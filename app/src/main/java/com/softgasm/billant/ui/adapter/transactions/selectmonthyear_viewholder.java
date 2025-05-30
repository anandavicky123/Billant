package com.softgasm.billant.ui.adapter.transactions;

import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;

public class selectmonthyear_viewholder extends RecyclerView.ViewHolder {

    TextView month_year, green, red;


    public selectmonthyear_viewholder(@NonNull View itemView) {
        super(itemView);

        month_year = itemView.findViewById(R.id.selectmonthyear_monthyear);
        green = itemView.findViewById(R.id.selectmonthyear_green);
        red = itemView.findViewById(R.id.selectmonthyear_red);

    }
}
