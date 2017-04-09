package com.example.gowri.whenbus;


import android.app.Activity;
import android.app.ProgressDialog;

import android.content.Intent;



import android.os.AsyncTask;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;

import android.widget.Button;
import android.widget.EditText;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import com.example.gowri.whenbus.Utilities.LoginSession;

import java.io.IOException;
import java.io.InputStream;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends Activity {


    /**
     * Keep track of the login task to ensure we can cancel it if requested.
     */
    private UserLoginTask mAuthTask = null;

    // UI references.
    private EditText mEmailView;
    private EditText mPasswordView;
    private ProgressDialog pDialog;
    private LoginSession loginSession;

    private RequestQueue queue;
    private boolean req=false,success;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        //Login session manager
        loginSession = new LoginSession(getApplicationContext());

        //Check state
        if(loginSession.isLoggedin()){
            Intent intent = new Intent(LoginActivity.this, Home.class);
            startActivity(intent);
            finish();
        }


        // Progress dialog
        pDialog = new ProgressDialog(this);
        pDialog.setCancelable(false);

        queue = Volley.newRequestQueue(this);
        // Set up the login form.
        mEmailView = (EditText) findViewById(R.id.email);
        mPasswordView = (EditText) findViewById(R.id.password);


        Button mEmailSignInButton = (Button) findViewById(R.id.email_sign_in_button);
        mEmailSignInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });

        Button register = (Button) findViewById(R.id.btnLinkToRegisterScreen);
        register.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, Resgister.class);
                startActivity(intent);
                finish();
            }
        });

    }



    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private void attemptLogin() {
        if (mAuthTask != null) {
            return;
        }

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        } else if (!isEmailValid(email)) {
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
            Log.d("Login","Password error");
            mPasswordView.setError(getString(R.string.error_invalid_password));
            focusView = mPasswordView;
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
            mAuthTask = new UserLoginTask(email, password);
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
        if(show) {
            pDialog.setMessage("Logging in...");
            pDialog.show();
        }
        else
            pDialog.dismiss();
    }



    /**
     * Represents an asynchronous login/registration task used to authenticate
     * the user.
     */
    private class UserLoginTask extends AsyncTask<Void, Void, Boolean> {

        private final String mEmail;
        private final String mPassword;

        UserLoginTask(String email, String password) {
            mEmail = email;
            mPassword = password;
        }

        @Override
        protected Boolean doInBackground(Void... params) {

            String url = "https://cs3410-whenbus.herokuapp.com/users/login";
            JSONObject user_log = new JSONObject();

            try {
                user_log.put("email", mEmail);
                user_log.put("password", mPassword);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            JsonObjectRequest login_post_req = new JsonObjectRequest(url, user_log, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    try {
                        Log.i("Test",jsonObject.getString("success"));
                        if(jsonObject.getString("success").equals("true")) {
                            success = true;
                            Log.i("Test_s","hey");
                        }else{
                            JSONObject error = jsonObject.getJSONObject("message");
                            if(error.getString("msg").equals("3")) {
                                mEmailView.setError("Invalid Email");
                                mEmailView.requestFocus();
                            }else if(error.getString("msg").equals("1")){
                                mPasswordView.setError("Password is incorrect");
                                mPasswordView.requestFocus();
                            }
                            success = false;
                            Log.i("Test_e","hey");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    req=true;
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.i("Onerror", "volley");
                    req=true;
                }
            });

            login_post_req.setTag(LoginActivity.class.getSimpleName());
            queue.add(login_post_req);


            while (!req){
                ;
            }
            req=false;
            Log.i("Test1","hey");
            return success;
        }

        @Override
        protected void onPostExecute(final Boolean success) {
            mAuthTask = null;
            showProgress(false);
            if (success) {
                loginSession.setLogin(true);
                Intent intent = new Intent(LoginActivity.this, Home.class);
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
