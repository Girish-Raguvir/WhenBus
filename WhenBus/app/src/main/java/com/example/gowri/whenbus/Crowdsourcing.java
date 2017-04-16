package com.example.gowri.whenbus;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.gowri.whenbus.fragment.home;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Crowdsourcing extends AppCompatActivity {

    private ProgressDialog pDialog;

    private boolean success=false;
    private boolean req = false;

    private RequestQueue queue;
    private JSONArray buslist;
    private int pos;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        speed_detect.mNM.cancel(speed_detect.NOTIFICATION);

        pDialog = new ProgressDialog(this);
        pDialog.setCancelable(true);

        queue = Volley.newRequestQueue(this);

        setContentView(R.layout.activity_main);

        Toolbar actionbar = (Toolbar) findViewById(R.id.toolbar);
        actionbar.setTitle("Crowdsourcing");
        setSupportActionBar(actionbar);

        Spinner bus_no = (Spinner) findViewById(R.id.bus_no);

        buslist = home.buslist;

        List<String> buslist_spinner = new ArrayList<String>();
        for(int i=0;i<buslist.length();i++){
            try {
                String temp = buslist.getJSONObject(i).getString("bus_no");
                buslist_spinner.add(temp.substring(0,temp.length()-2));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_dropdown_item,buslist_spinner);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        bus_no.setAdapter(adapter);

        bus_no.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                pos = position;
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }


        });

        Button submit = (Button) findViewById(R.id.Submit);
        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                pDialog.setMessage("Loading...");
                pDialog.show();
                update temp = new update(pos);
                temp.execute((Void) null);
            }
        });
    }

    /**
     * Represents an asynchronous login/registration task used to authenticate
     * the user.
     */
    private class update extends AsyncTask<Void, Void, Boolean> {

        JSONObject heuristics = new JSONObject();

        update(int position) {

            try {
                heuristics.put("bus_stop",home.nearby_id);
                heuristics.put("bus_no",buslist.getJSONObject(position).getString("bus_no"));
                heuristics.put("gps_lat",home.user_lat);
                heuristics.put("gps_lon",home.user_lon);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @Override
        protected Boolean doInBackground(Void... params) {
            success = false;


            String url = "https://cs3410-whenbus.herokuapp.com/heuristics";

            Log.d("JSON for direction",heuristics.toString());
            JsonObjectRequest login_post_req = new JsonObjectRequest(url, heuristics, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    success = true;
                    req=true;
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.i("Onerror", "volley");
                    success = false;
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

            pDialog.dismiss();
            Toast.makeText(getApplicationContext(),"Updated successfully!",Toast.LENGTH_LONG).show();
            finish();
        }

        @Override
        protected void onCancelled() {

        }

    }

    @Override
    public void onBackPressed(){
        finish();
        super.onBackPressed();
    }

}