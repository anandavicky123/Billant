package com.softgasm.billant.contents.calculations;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.flexbox.FlexDirection;
import com.google.android.flexbox.FlexboxLayoutManager;
import com.google.android.flexbox.JustifyContent;
import com.softgasm.billant.R;
import com.softgasm.billant.ui.adapter.calculations.ItemLoadFilter;
import com.softgasm.billant.ui.adapter.calculations.RecyclerSections;
import com.softgasm.billant.ui.adapter.calculations.others.SectionAdapter;
import com.softgasm.billant.ui.adapter.calculations.others.SectionInfoFactory;
import com.softgasm.billant.ui.adapter.calculations.others.SectionItemInfoDialog;
import com.softgasm.billant.ui.adapter.calculations.others.SectionItemInfoFactory;
import com.softgasm.billant.ui.adapter.calculations.others.SectionedRecyclerViewAdapter;


public class commons_main extends Fragment implements RecyclerSections.ClickListener{

    private static final String DIALOG_TAG = "SectionItemInfoDialogTag";
    View view;
    private SectionedRecyclerViewAdapter sectionedAdapter;

    public commons_main() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_commons, container, false);

        sectionedAdapter = new SectionedRecyclerViewAdapter();

        final ItemLoadFilter itemLoadFilter = new ItemLoadFilter();
        sectionedAdapter.addSection(new RecyclerSections(getString(R.string.sales),
                itemLoadFilter.execute(requireContext(), R.array.commonsales), this,  R.drawable.baseline_123_24));
        sectionedAdapter.addSection(new RecyclerSections(getString(R.string.financialplanning),
                itemLoadFilter.execute(requireContext(), R.array.commonfplanning), this,  R.drawable.baseline_123_24));
        sectionedAdapter.addSection(new RecyclerSections(getString(R.string.others),
                itemLoadFilter.execute(requireContext(), R.array.commonothers), this,  R.drawable.baseline_123_24));



        final RecyclerView recyclerView = view.findViewById(R.id.commonview);

        FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(requireContext());
        layoutManager.setFlexDirection(FlexDirection.ROW);
        layoutManager.setJustifyContent(JustifyContent.CENTER);

        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(sectionedAdapter);



        return view;
    }

    @Override
    public void onHeaderRootViewClicked(@NonNull final RecyclerSections section) {
        final SectionAdapter sectionAdapter = sectionedAdapter.getAdapterForSection(section);

        // store info of current section state before changing its state
        final boolean wasExpanded = section.isExpanded();
        final int previousItemsTotal = section.getContentItemsTotal();

        section.setExpanded(!wasExpanded);
        sectionAdapter.notifyHeaderChanged();

        if (wasExpanded) {
            sectionAdapter.notifyItemRangeRemoved(0, previousItemsTotal);
        } else {
            sectionAdapter.notifyAllItemsInserted();
        }
    }

    @Override
    public void onItemRootViewClicked(@NonNull RecyclerSections section, int itemAdapterPosition) {
        final SectionItemInfoDialog dialog = SectionItemInfoDialog.getInstance(
                SectionItemInfoFactory.create(itemAdapterPosition, sectionedAdapter),
                SectionInfoFactory.create(section, sectionedAdapter.getAdapterForSection(section))
        );
        dialog.show(getParentFragmentManager(), DIALOG_TAG);
    }

}