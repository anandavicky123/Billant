package com.softgasm.billant.ui.adapter.transactions;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;

public class transactions_viewholder extends RecyclerView.ViewHolder {
TextView name, amount, type, date, time, category;
ImageView category_icon;

    public transactions_viewholder(@NonNull View itemView) {
        super(itemView);
        name = itemView.findViewById(R.id.transactions_show_name);
        amount = itemView.findViewById(R.id.transactions_show_amount);
        type = itemView.findViewById(R.id.transactions_show_type);
        date = itemView.findViewById(R.id.transactions_show_date);
        time = itemView.findViewById(R.id.transactions_show_time);
        category = itemView.findViewById(R.id.transaction_category_name);
        category_icon = itemView.findViewById(R.id.transaction_category_icon);
    }
}
