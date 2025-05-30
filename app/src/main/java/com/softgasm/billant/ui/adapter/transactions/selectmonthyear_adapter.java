package com.softgasm.billant.ui.adapter.transactions;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;
import com.softgasm.billant.home;

import java.util.ArrayList;

public class selectmonthyear_adapter extends RecyclerView.Adapter<selectmonthyear_viewholder> {

    private ArrayList<SelectMonthYear> listTransactions;


    public selectmonthyear_adapter(ArrayList<SelectMonthYear> listTransactions) {
        this.listTransactions = listTransactions;
    }

    @NonNull
    @Override
    public selectmonthyear_viewholder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_selectmonthyear_item, parent, false);
        return new selectmonthyear_viewholder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull selectmonthyear_viewholder holder, int position) {
        final SelectMonthYear smy = listTransactions.get(position);
        holder.month_year.setText(smy.getMonthYear());
        holder.green.setText(smy.getIncomes());
        holder.red.setText(smy.getExpenses());
        holder.itemView.setOnClickListener(v -> {
           if (home.temporaryYearisSelected){
               home.temporaryYear = smy.getMonthYear();
               home.selectTab.getTabAt(0).select();
           } else {
                home.doTheSelection(smy.getMonth(), v.getContext());
           }
        });

    }

    @Override
    public int getItemCount() {
        return listTransactions.size();
    }
}
