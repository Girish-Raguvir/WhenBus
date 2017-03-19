package com.example.gowri.whenbus.Utilities;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * Created by gowri on 20/3/17.
 */


public class LoginSession {
    //Log TAG
    private static String TAG = LoginSession.class.getSimpleName();

    //Shared preference for storing login state
    SharedPreferences pref;

    SharedPreferences.Editor editor;
    Context context;

    //Shared preferences file name
    private static final String name = "WhenBusLogin";

    public LoginSession(Context _context){
        this.context = _context;
        pref = _context.getSharedPreferences(name,0);
        editor = pref.edit();
    }

    public void setLogin(boolean login){
        editor.putBoolean("isLogin",login);
        editor.commit();
        Log.d(TAG,"Session changed");
    }

    public boolean isLoggedin(){
        return pref.getBoolean("isLogin",false);
    }
}
