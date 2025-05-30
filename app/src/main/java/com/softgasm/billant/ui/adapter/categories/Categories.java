package com.softgasm.billant.ui.adapter.categories;

import android.content.Context;

import androidx.annotation.DrawableRes;

import com.softgasm.billant.system.Filters;

public class Categories {
    private String name;
    private int type;
    private byte[] icon64;


    public Categories(Context context, String name, int type, @DrawableRes int drawable){
        this.name = name;
        this.type = type;
        icon64 = Filters.DrawableToByte(context, drawable);
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public int getType() {
        return type;
    }
    public void setType(int type) {
        this.type = type;
    }

    public byte[] getRawBitmap() {
        return icon64;
    }
    public void setRawBitmap(byte[] icon64) {
        this.icon64 = icon64;
    }

}
