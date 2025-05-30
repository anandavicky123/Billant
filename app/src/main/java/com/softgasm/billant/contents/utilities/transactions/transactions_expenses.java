package com.softgasm.billant.contents.utilities.transactions;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.mikephil.charting.charts.PieChart;
import com.softgasm.billant.R;
import com.softgasm.billant.home;
import com.softgasm.billant.ui.adapter.transactions.chartdata;
import com.softgasm.billant.ui.adapter.transactions.transactions_adapter;

public class transactions_expenses extends Fragment {

    View view;

    public static boolean expenses_isVisible = false;

    static PieChart pieChart;

    static RecyclerView transactions_view;

    static String query = "select * from transactions where type=1 and month = " + home.month + " and year = " + home.year;

    public transactions_expenses() {
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
        view = inflater.inflate(R.layout.fragment_transactions_expenses, container, false);
        transactions_view = view.findViewById(R.id.expenses_transactions_recyclerview);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(requireContext());
        transactions_view.setLayoutManager(linearLayoutManager);

        transactions_adapter mAdapter = new transactions_adapter(requireContext(), query);
        transactions_view.setAdapter(mAdapter);


        pieChart = view.findViewById(R.id.expenses_chart);
        pieChart.getDescription().setEnabled(false);
        pieChart.setUsePercentValues(true);
        pieChart.animateY(800);

        return view;
    }

    public static void update(Context context) {
        String query = "select * from transactions where type=1 and month = " + home.month + " and year = " + home.year;
        transactions_adapter mAdapter = new transactions_adapter(context, query);
        transactions_view.setAdapter(mAdapter);

        String chartQuery = "select category, count(category) as amout from transactions where type = 1 and month = " + home.month + " and year = " + home.year + " group by category";
        pieChart.setData(chartdata.PieData(context, "Expenses", chartQuery));
        pieChart.invalidate();
    }

    @Override
    public void onResume() {
        super.onResume();
        expenses_isVisible = true;
        update(requireContext());
    }

    @Override
    public void onPause() {
        super.onPause();
        expenses_isVisible = false;
    }
}