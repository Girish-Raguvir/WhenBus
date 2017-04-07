package com.example.gowri.whenbus.fragment;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.AbsListView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.gowri.whenbus.Home;
import com.example.gowri.whenbus.R;

import java.util.ArrayList;
import java.util.List;

import static java.sql.Types.NULL;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link home.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link home#newInstance} factory method to
 * create an instance of this fragment.
 */
public class home extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    private EditText search;

    //Parallax
    private TextView stickyView;
    private ListView listView;
    private TextView heroImageView;

    private View stickyViewSpacer;

    private int MAX_ROWS = 20;

    private View v;

    public home() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment home.
     */
    // TODO: Rename and change types and number of parameters
    public static home newInstance(String param1, String param2) {
        home fragment = new home();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }


    private void search_destination() {
        ;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        v = inflater.inflate(R.layout.fragment_home, container, false);

        search = (EditText)v.findViewById(R.id.search);
        search.setOnEditorActionListener(new TextView.OnEditorActionListener() {

            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == R.id.search || actionId== EditorInfo.IME_NULL) {
                    if(event.getAction() == KeyEvent.ACTION_DOWN) {
                        //Toast.makeText(getActivity().getApplicationContext(), "Search success", Toast.LENGTH_LONG).show();
                        search_destination();
                        Home home = (Home) getActivity();
                        //home.loadmap();
                        loadparallax();
                    }


                }
                return false;
            }
        });
        // Inflate the layout for this fragment
        return v;
    }

    private void loadparallax(){

        FrameLayout frame = (FrameLayout) v.findViewById(R.id.search_frame);
        if(frame.getVisibility()==View.INVISIBLE){
            frame.setVisibility(View.VISIBLE);
        }

        /* Initialise list view, hero image, and sticky view */
        listView = (ListView) v.findViewById(R.id.listView);
        heroImageView = (TextView) v.findViewById(R.id.heroImageView);
        stickyView = (TextView) v.findViewById(R.id.stickyView);

        /* Inflate list header layout */
        LayoutInflater inflater = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View listHeader = inflater.inflate(R.layout.list_header, null);
        stickyViewSpacer = listHeader.findViewById(R.id.stickyViewPlaceholder);

        View bus_stop = listHeader.findViewById(R.id.bus_stop);
        heroImageView.setText("Nearby stop:\nCRC bus stop");
        heroImageView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                Home home = (Home)getActivity();
                home.loadmap();
                return true;
            }
        });




        if(listView.getHeaderViewsCount()!=0){
            //Toast.makeText(getActivity().getApplicationContext(),"Header iruke"+listView.getHeaderViewsCount(),Toast.LENGTH_SHORT).show();
            View old = listView.findViewWithTag("Oldheader");
            if(old!=null){
                listView.removeHeaderView(old);
            }
        }

        listHeader.setTag("Oldheader");
        /* Add list view header */
        listView.addHeaderView(listHeader);

        /* Handle list View scroll events */
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {

            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

                /* Check if the first item is already reached to top.*/
                if (listView.getFirstVisiblePosition() == 0) {
                    View firstChild = listView.getChildAt(0);
                    int topY = 0;
                    if (firstChild != null) {
                        topY = firstChild.getTop();
                    }

                    int heroTopY = stickyViewSpacer.getTop();
                    stickyView.setY(Math.max(0, heroTopY + topY));

                    /* Set the image to scroll half of the amount that of ListView */
                    heroImageView.setY(topY * 0.5f);
                }
            }
        });


        /* Populate the ListView with sample data */
        List<String> modelList = new ArrayList<>();
        for (int i = 0; i < MAX_ROWS; i++) {
            modelList.add("Bus No " + (i+1) +"\nETA "+5*(i+1)+" mins");
        }

        ArrayAdapter adapter = new ArrayAdapter(getActivity().getApplicationContext(), R.layout.list_row,modelList);
        listView.setAdapter(adapter);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
//        if (context instanceof OnFragmentInteractionListener) {
//            mListener = (OnFragmentInteractionListener) context;
//        } else {
//            throw new RuntimeException(context.toString()
//                    + " must implement OnFragmentInteractionListener");
//        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
