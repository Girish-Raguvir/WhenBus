package com.example.gowri.whenbus;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.app.LoaderManager.LoaderCallbacks;

import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static android.Manifest.permission.READ_CONTACTS;

/**
 * A login screen that offers login via email/password.
 */
public class Resgister extends Activity {


    /**
     * Keep track of the login task to ensure we can cancel it if requested.
     */
    private UserRegisterTask mAuthTask = null;

    // UI references.
    private EditText mEmailView;
    private EditText mPasswordView;
    private EditText mCPasswordView;
    private EditText mName;
    private ProgressDialog pDialog;


    // Registering
    private RequestQueue queue;
    private boolean success,req=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_resgister);
        // Set up the login form.
        mEmailView = (EditText) findViewById(R.id.email);
        mPasswordView = (EditText) findViewById(R.id.password);
        mCPasswordView = (EditText) findViewById(R.id.password_confirm);
        mName = (EditText) findViewById(R.id.name);



        pDialog = new ProgressDialog(this);
        pDialog.setCancelable(false);

        queue = Volley.newRequestQueue(this);

        Button mRegister = (Button) findViewById(R.id.btnRegister);
        mRegister.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptRegister();
            }
        });

        Button mLogin = (Button) findViewById(R.id.btnLinkToLoginScreen);
        mLogin.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Resgister.this, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        });

    }


    //Attempt register
    private void attemptRegister() {
        if (mAuthTask != null) {
            return;
        }

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);
        mCPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();
        String cpassword = mCPasswordView.getText().toString();
        String name = mName.getText().toString();

        boolean cancel = false;
        View focusView = null;

        //Non empty name
        if(TextUtils.isEmpty(name)){
            mName.setError(getString(R.string.error_field_required));
            focusView = mName;
            cancel = true;
        }

        // Check for a valid email address.
        if (!cancel &&TextUtils.isEmpty(email)) {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        } else if (!cancel && !isEmailValid(email)) {
            mEmailView.setError(getString(R.string.error_invalid_email));
            focusView = mEmailView;
            cancel = true;
        }

        if(!cancel && TextUtils.isEmpty(password)){
            mPasswordView.setError(getString(R.string.error_field_required));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid password, if the user entered one.
        if (!cancel && !TextUtils.isEmpty(password) && !isPasswordValid(password)) {
            mPasswordView.setError(getString(R.string.error_invalid_password));
            focusView = mPasswordView;
            cancel = true;
        }

        //Check same password
        if(!cancel && !password.equals(cpassword)){
            mCPasswordView.setError("Password mismatch");
            focusView = mCPasswordView;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true);
            mAuthTask = new UserRegisterTask(email, password, name);
            mAuthTask.execute((Void) null);
        }
    }

    private boolean isEmailValid(String email) {
        return email.contains("@");
    }

    private boolean isPasswordValid(String password) {
        return password.length() > 4;
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    private void showProgress(final boolean show) {

        if(show){
            pDialog.setMessage("Registering...");
            pDialog.show();
        }else{
            pDialog.dismiss();
        }
    }


    /**
     * Represents an asynchronous login/registration task used to authenticate
     * the user.
     */
    public class UserRegisterTask extends AsyncTask<Void, Void, Boolean> {

        private final String mName;
        private final String mEmail;
        private final String mPassword;

        UserRegisterTask(String email, String password,String mName) {
            this.mName = mName;
            mEmail = email;
            mPassword = password;
        }

        @Override
        protected Boolean doInBackground(Void... params) {
            // TODO: attempt authentication against a network service.

            String url = "https://cs3410-whenbus.herokuapp.com/users/register";
            JSONObject user_register = new JSONObject();

            try {
                user_register.put("email", mEmail);
                user_register.put("password", mPassword);
                user_register.put("name", mName);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            Log.d("Register",user_register.toString());

            JsonObjectRequest register_post_req = new JsonObjectRequest(url, user_register, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    Log.d("Register",jsonObject.toString());
                    try {
                        if(jsonObject.getString("success").equals("true")) {
                            success = true;
                            Log.d("Register","Success");
                        }else{
                            JSONObject error = jsonObject.getJSONObject("message");
                            if(error.getString("msg").equals("4")) {
                                mEmailView.setError("Already exists");
                                mEmailView.requestFocus();
                            }
                            success = false;
                            Log.i("Register","Fail");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    req=true;
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.i("Register", "volley");
                    req=true;
                }
            });

            register_post_req.setTag(Resgister.class.getSimpleName());
            queue.add(register_post_req);

            while (!req){
                ;
            }
            req=false;
            Log.i("Register","Done");
            // TODO: register the new account here.
            return success;
        }

        @Override
        protected void onPostExecute(final Boolean success) {
            mAuthTask = null;
            showProgress(false);

            if (success) {
                Intent intent = new Intent(Resgister.this, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        }

        @Override
        protected void onCancelled() {
            mAuthTask = null;
            showProgress(false);
        }
    }
}

