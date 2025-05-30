package com.softgasm.billant.ui.adapter.calculations;

import android.content.Context;

import androidx.annotation.ArrayRes;
import androidx.annotation.NonNull;
import androidx.annotation.StringRes;

import com.softgasm.billant.R;
import com.softgasm.billant.system.App;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class ItemLoadFilter {

    public List<Items> execute(@NonNull final Context context, @ArrayRes final int stringArray) {
        final List<String> arrayList = new ArrayList<>(Arrays.asList(
                context.getResources().getStringArray(stringArray)));

        final List<Items> itemsList = new ArrayList<>();

        for (String str : arrayList) {
            itemsList.add(new Items(str, getIcon(str), getDesc(str)));
        }

        return itemsList;
    }

    private int getIcon(@NonNull final String name) {
        //TODO: TAMBAHKAN GAMBAR UNTUK SETIAP PERHITUNGAN
        int theimage;
        if (name.equals(gs(R.string.unitprice))) {
            theimage = R.drawable.baseline_123_24;
        }




        else {
            theimage = R.drawable.baseline_123_24;
        }

        return theimage;
    }

    private String getDesc(@NonNull final String name) {
        //TODO: TAMBAHKAN GAMBAR UNTUK SETIAP PERHITUNGAN
        String thedesc;
        if (name.equals(gs(R.string.unitprice))) {
            thedesc = App.getAppResources().getString(R.string.about);
        }




        else {
            thedesc = "null";
        }

        return thedesc;
    }

    private String gs(@StringRes int string){
        return App.getAppResources().getString(string);
    }
}
