package com.softgasm.billant.ui.adapter.calculations;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.StringRes;

public final class Items {
    public final String name;

    public final String desc;
    public final int image;


    public Items(@NonNull final String name, @DrawableRes int image, String desc) {
        this.name = name;
        this.image = image;
        this.desc = desc;
    }
}
