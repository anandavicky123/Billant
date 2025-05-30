package com.softgasm.billant.ui.adapter.categories;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.IdRes;

public class categories_viewholder {
    TextView name;
    ImageView icon;

    public categories_viewholder(View view, @IdRes int nameView, @IdRes int iconView){
        name = view.findViewById(nameView);
        icon = view.findViewById(iconView);
    }
}
