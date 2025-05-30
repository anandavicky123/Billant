package com.softgasm.billant.ui.adapter.categories;

import android.content.Context;
import android.database.Cursor;

import com.softgasm.billant.system.Database;

import java.util.ArrayList;

public class categories_database {
    private Cursor cursor(Context context, int type) {
        return Database.getCursor(context, "select * from categories where type=" + type);
    }


    public static ArrayList<byte[]> getIcon(Context context, int type) {
        Cursor thecursor = new categories_database().cursor(context, type);
        ArrayList<byte[]> raw_icon = new ArrayList<>();
        if (thecursor.moveToFirst()) {
            do {
                raw_icon.add(thecursor.getBlob(3));
            } while (thecursor.moveToNext());
        }
        return raw_icon;
    }


    public static ArrayList<String> getNames(Context context, int type) {
        Cursor thecursor = new categories_database().cursor(context, type);
        ArrayList<String> names_array = new ArrayList<>();
        if (thecursor.moveToFirst()) {
            do {
                names_array.add(thecursor.getString(1));
            } while (thecursor.moveToNext());
        }
        return names_array;
    }


}
