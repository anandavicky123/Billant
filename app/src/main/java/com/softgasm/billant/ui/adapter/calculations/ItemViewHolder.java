package com.softgasm.billant.ui.adapter.calculations;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;

public class ItemViewHolder extends RecyclerView.ViewHolder {

    public final View rootView;
    public final TextView tvItem;

    public final TextView tvItemDesc;

    public final ImageView image;

    public ItemViewHolder(@NonNull final View view) {
        super(view);

        rootView = view;
        tvItem = view.findViewById(R.id.tvItem);
        image = view.findViewById(R.id.imgItem);
        tvItemDesc = view.findViewById(R.id.tvItemDesc);
    }
}
