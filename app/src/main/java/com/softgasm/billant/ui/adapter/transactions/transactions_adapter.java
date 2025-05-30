package com.softgasm.billant.ui.adapter.transactions;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;
import com.softgasm.billant.home;
import com.softgasm.billant.system.App;
import com.softgasm.billant.system.Database;
import com.softgasm.billant.system.Filters;

import java.util.ArrayList;
import java.util.Currency;

public class transactions_adapter extends RecyclerView.Adapter<transactions_viewholder> {
    private ArrayList<Transactions> listTransactions;
    Context context;


    public transactions_adapter(Context context, String query) {
        this.context = context;
        Cursor thecursor = Database.getCursor(context, query);
        ArrayList<Transactions> transactions_arraylist = new ArrayList<>();
        if (thecursor.moveToFirst()) {
            do {
                int type = thecursor.getInt(2);
                String type_s;
                if (type == 0){
                    type_s = context.getString(R.string.income);
                } else {
                    type_s = context.getString(R.string.expense);
                }
                String name = thecursor.getString(1);
                double amount = thecursor.getDouble(3);
                int day = thecursor.getInt(6);
                int month = thecursor.getInt(7);
                int year = thecursor.getInt(8);
                String time = thecursor.getString(9);
                String desc = thecursor.getString(5);
                String category = thecursor.getString(4);
                Bitmap category_icon = Filters.BlobToBitmap(thecursor.getBlob(10));
                transactions_arraylist.add(new Transactions(name, amount, type_s, Filters.LocaleDate(context, day, month, year), time, category, category_icon, desc));
            }
            while (thecursor.moveToNext());
        }
        thecursor.close();
        listTransactions = transactions_arraylist;
    }


    @NonNull
    @Override
    public transactions_viewholder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_transactions_item, parent, false);
        return new transactions_viewholder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull transactions_viewholder holder, int position) {
        final Transactions transactions = listTransactions.get(position);
        holder.name.setText(transactions.getName());

        holder.date.setText(transactions.getDate());
        String thetype = transactions.getType();
        String operator;
        if (thetype.equals(App.getAppResources().getString(R.string.income))) {
            operator = "+";
            holder.type.setBackgroundColor(ContextCompat.getColor(context, R.color.green));
            holder.amount.setTextColor(ContextCompat.getColor(context, R.color.green));
        } else {
            operator = "-";
            holder.type.setBackgroundColor(ContextCompat.getColor(context, R.color.red));
            holder.amount.setTextColor(ContextCompat.getColor(context, R.color.red));
        }
        holder.type.setText(thetype);

        Currency currency = Currency.getInstance(App.getSystemLocale());
        String currency_symbol = currency.getSymbol();
        holder.amount.setText(operator + currency_symbol + Filters.simplifiednumbers(transactions.getAmount()));
        try {
            holder.category.setText(transactions.getCategory());
            holder.category_icon.setImageBitmap(transactions.getCategoryIcon());

        } catch (NullPointerException ignored){

        }

        holder.time.setText(transactions.getTime());

        holder.itemView.setOnClickListener(v -> {
            home.getItemDetails(v.getContext(), transactions.getName(), transactions.getDate(), transactions.getTime(), operator + currency_symbol + Filters.simplifiednumbers(transactions.getAmount()), transactions.getType(), transactions.getCategory(), transactions.getDesc(), transactions.getCategoryIcon());
        });
    }

    @Override
    public int getItemCount() {
        return listTransactions.size();
    }
}
