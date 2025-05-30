package com.softgasm.billant.ui.adapter.calculations;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;


public class HeaderViewHolder extends RecyclerView.ViewHolder {
    public final View rootView;
    public final TextView tvTitle;
    public final ImageView imgArrow, icon;

    public HeaderViewHolder(@NonNull final View view) {
        super(view);
        rootView = view;
        tvTitle = view.findViewById(R.id.tvTitle);
        imgArrow = view.findViewById(R.id.imgArrow);
        icon = view.findViewById(R.id.header_icon);
    }
}
