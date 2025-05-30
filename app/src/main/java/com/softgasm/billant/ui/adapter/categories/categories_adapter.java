package com.softgasm.billant.ui.adapter.categories;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.softgasm.billant.R;
import com.softgasm.billant.system.Filters;

public class categories_adapter extends BaseAdapter {


    int type;
    Context context;

    public categories_adapter(@NonNull Context context, int type) {
        this.context = context;
        this.type = type;
    }

    @Override
    public int getCount() {
        return categories_database.getNames(context, type).size();
    }

    @Override
    public Object getItem(int position) {
        return null;
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View view, @NonNull ViewGroup parent) {

        LayoutInflater mInflater = (LayoutInflater) context.
                getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        if (view == null) view = mInflater.inflate(R.layout.spinner_image_text, parent, false);

        categories_viewholder vh = new categories_viewholder(view, R.id.spinner_item_name, R.id.spinner_item_icon);
        view.setTag(vh);
        vh.icon.setImageBitmap(Filters.getBitmap(categories_database.getIcon(context, type), position));
        vh.name.setText(categories_database.getNames(context, type).get(position));

        return view;

    }

    @Override
    public View getDropDownView(int position, View view, ViewGroup parent) {
        return getView(position, view, parent);
    }
}
