package com.softgasm.billant.ui.adapter.transactions;

import android.content.Context;
import android.database.Cursor;

import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.softgasm.billant.system.Database;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class chartdata {

    public static PieData PieData(Context context, String label, String query) {
        Cursor thecursor = Database.getCursor(context, query);
        ArrayList<PieEntry> pieEntries = new ArrayList<>();
        Map<String, Integer> chartMap = new HashMap<>();
        if (thecursor.moveToFirst()) {
            do {
                String name = thecursor.getString(0);
                int category_amount = thecursor.getInt(1);
                chartMap.put(name, category_amount);
            }
            while (thecursor.moveToNext());
            thecursor.close();
        }
        for(String type: chartMap.keySet()){
            pieEntries.add(new PieEntry(chartMap.get(type).floatValue(), type));
        }

        //collecting the entries with label name
        PieDataSet pieDataSet = new PieDataSet(pieEntries, label);
        pieDataSet.setValueTextSize(12f);
        PieData pieData = new PieData(pieDataSet);
        pieData.setDrawValues(true);
        pieDataSet.setColors(ColorTemplate.MATERIAL_COLORS);
        return pieData;
    }






}
