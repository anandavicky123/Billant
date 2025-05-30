package com.softgasm.billant.contents.utilities.transactions;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;
import com.softgasm.billant.home;
import com.softgasm.billant.ui.adapter.transactions.transactions_adapter;

public class all_transactions extends Fragment {

    public static boolean all_transactions_isVisible = false;
    View view;
    static RecyclerView transactions_view;

    public all_transactions() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_transactions_all, container, false);
        transactions_view = view.findViewById(R.id.all_transactions_recyclerview);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(requireContext());
        transactions_view.setLayoutManager(linearLayoutManager);

        String query = "select * from transactions where month = " + home.month + " and year = " + home.year;
        transactions_adapter mAdapter = new transactions_adapter(requireContext(), query);
        transactions_view.setAdapter(mAdapter);

        return view;
    }

    public static void update(Context context){
        String query = "select * from transactions where month = " + home.month + " and year = " + home.year;
        transactions_adapter mAdapter = new transactions_adapter(context, query);
        transactions_view.setAdapter(mAdapter);
    }

    @Override
    public void onResume() {
        super.onResume();
        all_transactions_isVisible = true;
        update(requireContext());
    }

    @Override
    public void onPause() {
        super.onPause();
        all_transactions_isVisible = false;
    }
}