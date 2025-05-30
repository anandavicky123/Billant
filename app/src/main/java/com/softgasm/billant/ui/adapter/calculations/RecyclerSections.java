package com.softgasm.billant.ui.adapter.calculations;

import android.view.View;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.StringRes;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.softgasm.billant.R;
import com.softgasm.billant.system.App;
import com.softgasm.billant.ui.adapter.calculations.others.Section;
import com.softgasm.billant.ui.adapter.calculations.others.SectionParameters;

import java.util.List;

public final class RecyclerSections extends Section {

    private final String title;

    private final @DrawableRes int headericon;
    private final List<Items> list;
    private final ClickListener clickListener;
    private boolean expanded = true;

    View newview;

    public RecyclerSections(@NonNull final String title, @NonNull final List<Items> list,
                            @NonNull final ClickListener clickListener, @DrawableRes final int headericon) {
        super(SectionParameters.builder()
                .itemResourceId(R.layout.view_tiles)
                .headerResourceId(R.layout.header)
                .build());

        this.title = title;
        this.headericon = headericon;
        this.list = list;
        this.clickListener = clickListener;
    }

    @Override
    public int getContentItemsTotal() {
        return expanded ? list.size() : 0;
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(final View view) {
        return new ItemViewHolder(view);
    }

    @Override
    public void onBindItemViewHolder(final RecyclerView.ViewHolder holder, final int position) {
        final ItemViewHolder itemHolder = (ItemViewHolder) holder;

        final Items theitems = list.get(position);
        String iii = theitems.name;
        itemHolder.tvItem.setText(theitems.name);
        itemHolder.image.setImageResource(theitems.image);
        itemHolder.tvItemDesc.setText(theitems.desc);

        itemHolder.rootView.setOnClickListener(v -> {
            itemname = theitems.name;
            icon = theitems.image;
            newview = v;

            //General - Basic Measurements

            if (iii.equals(gs(R.string.unitprice))) {
                Navigation.findNavController(newview).navigate(R.id.unitprice);
            } else if (iii.equals(gs(R.string.consumptiontax))) {
                Navigation.findNavController(newview).navigate(R.id.consumptiontax);
            }

        });
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(final View view) {
        return new HeaderViewHolder(view);
    }

    @Override
    public void onBindHeaderViewHolder(final RecyclerView.ViewHolder holder) {
        final HeaderViewHolder headerHolder = (HeaderViewHolder) holder;

        headerHolder.tvTitle.setText(title);

        headerHolder.icon.setImageResource(headericon);

        headerHolder.imgArrow.setImageResource(
                expanded ? R.drawable.ic_keyboard_arrow_up_black_18dp : R.drawable.ic_keyboard_arrow_down_black_18dp
        );
        headerHolder.rootView.setOnClickListener(v -> clickListener.onHeaderRootViewClicked(this));
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(final boolean expanded) {
        this.expanded = expanded;
    }

    public interface ClickListener {

        void onHeaderRootViewClicked(@NonNull final RecyclerSections section);

        void onItemRootViewClicked(@NonNull final RecyclerSections section, final int itemAdapterPosition);
    }


    static String req, itemname, desc = "null";

    static @DrawableRes int icon;

    public static String name() {
        return itemname;
    }

    public static String desctext() {
        return desc;
    }

    public static int icon() {
        return icon;
    }

    private String gs(@StringRes int string) {
        return App.getAppResources().getString(string);
    }

}
