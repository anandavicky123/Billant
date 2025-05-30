package com.softgasm.billant;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.TimePickerDialog;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.flexbox.FlexDirection;
import com.google.android.flexbox.FlexboxLayoutManager;
import com.google.android.flexbox.JustifyContent;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.tabs.TabLayout;
import com.softgasm.billant.contents.utilities.transactions.all_transactions;
import com.softgasm.billant.contents.utilities.transactions.transactions_comparison;
import com.softgasm.billant.contents.utilities.transactions.transactions_expenses;
import com.softgasm.billant.contents.utilities.transactions.transactions_incomes;
import com.softgasm.billant.system.App;
import com.softgasm.billant.system.Database;
import com.softgasm.billant.system.Filters;
import com.softgasm.billant.ui.adapter.categories.categories_adapter;
import com.softgasm.billant.ui.adapter.categories.categories_database;
import com.softgasm.billant.ui.adapter.transactions.SelectMonthYear;
import com.softgasm.billant.ui.adapter.transactions.selectmonthyear_adapter;
import com.softgasm.billant.ui.adapter.transactions.transactions_viewpager;

import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

@SuppressLint({"SetTextI18n", "ClickableViewAccessibility"})
public class home extends Fragment {

    public static String temporaryYear = "null";
    public static TabLayout selectTab;
    public static boolean temporaryYearisSelected = false;
    public static int hour, minute, year, month, day;
    public static Dialog selectDialog;
    static Calendar calendar;
    static SimpleDateFormat month_date = new SimpleDateFormat("MMMM", App.getSystemLocale());
    private static Button selectMonth_Year;
    final Calendar currentCalendar = Calendar.getInstance();
    View view;
    FloatingActionButton expenseFAB, incomeFAB;
    ExtendedFloatingActionButton mAddFab;
    TextView expenseFABTEXT, incomeFABTEXT, date_tv;
    Boolean isAllFabsVisible;
    String localizedTime;
    Button previousMonth;
    Button nextMonth;
    int type;
    transactions_viewpager adapter;
    ViewPager2 vp;

    private static void update_all(Context context) {
        if (all_transactions.all_transactions_isVisible) {
            try {
                all_transactions.update(context);
            } catch (NullPointerException e) {
                Log.e("all_transactions", "Error Update", e);
            }
        }
        if (transactions_expenses.expenses_isVisible) {
            try {
                transactions_expenses.update(context);
            } catch (NullPointerException e) {
                Log.e("transactions_expenses", "Error Update", e);
            }
        }
        if (transactions_incomes.incomes_isVisible) {
            try {
                transactions_incomes.update(context);
            } catch (NullPointerException e) {
                Log.e("transactions_incomes", "Error Update", e);
            }
        }

    }

    public static void doTheSelection(int month1, Context context) {
        selectDialog.dismiss();
        calendar.set(Calendar.MONTH, month1);
        month = calendar.get(Calendar.MONTH);
        if (!temporaryYear.equals("null")) {
            calendar.set(Calendar.YEAR, Integer.parseInt(temporaryYear));
            year = Integer.parseInt(temporaryYear);
            temporaryYear = "null";
        }
        selectMonth_Year.setText(Filters.getMonthName(month1) + "\n" + year);
        update_all(context);
    }

    public static void getItemDetails(Context context, String title, String date, String time, String amount, String type, String category, String note, Bitmap icon) {

        Dialog itemDetailsDialog = new Dialog(context);
        itemDetailsDialog.setContentView(R.layout.dialog_transaction_item_details);
        itemDetailsDialog.setCanceledOnTouchOutside(true);
        itemDetailsDialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        itemDetailsDialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        Button closebutton = itemDetailsDialog.findViewById(R.id.tid_closebutton);
        closebutton.setOnClickListener(v -> itemDetailsDialog.dismiss());

        TextView titleTV = itemDetailsDialog.findViewById(R.id.tid_title);
        titleTV.setText(title);
        TextView dateTV = itemDetailsDialog.findViewById(R.id.tid_date);
        dateTV.setText(date);
        TextView timeTV = itemDetailsDialog.findViewById(R.id.tid_time);
        timeTV.setText(time);
        TextView amountTV = itemDetailsDialog.findViewById(R.id.tid_amount);
        amountTV.setText(amount);
        TextView typeTV = itemDetailsDialog.findViewById(R.id.tid_type);
        typeTV.setText(type);
        TextView categoryTV = itemDetailsDialog.findViewById(R.id.tid_category);
        categoryTV.setText(category);
        TextView noteTV = itemDetailsDialog.findViewById(R.id.tid_notes);
        noteTV.setText(note);

        ImageView iconShow = itemDetailsDialog.findViewById(R.id.tid_icon);
        iconShow.setImageBitmap(icon);
        itemDetailsDialog.show();


    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_home, container, false);
        calendar = Calendar.getInstance();
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH) + 1;
        day = calendar.get(Calendar.DAY_OF_MONTH);
        hour = calendar.get(Calendar.HOUR_OF_DAY);
        minute = calendar.get(Calendar.MINUTE);
        return view;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onStart() {
        super.onStart();

        mAddFab = view.findViewById(R.id.homefloat);

        // FAB button
        expenseFAB = view.findViewById(R.id.fab_home_expense);
        incomeFAB = view.findViewById(R.id.fab_home_income);
        expenseFABTEXT = view.findViewById(R.id.home_expense_fab_text);
        incomeFABTEXT = view.findViewById(R.id.home_income_fab_text);

        vp = view.findViewById(R.id.transaction_pager);
        adapter = new transactions_viewpager(requireActivity());
        adapter.addFragment(new all_transactions());
        adapter.addFragment(new transactions_expenses());
        adapter.addFragment(new transactions_incomes());
        adapter.addFragment(new transactions_comparison());
        vp.setAdapter(adapter);


        BottomNavigationView theview = view.findViewById(R.id.transaction_bottomnavigationview);
        theview.setOnItemSelectedListener(item -> {
            int aaa = 0;
            if (item.getItemId() == R.id.transactions_all) {
                aaa = 0;
            } else if (item.getItemId() == R.id.transactions_expense) {
                aaa = 1;
            } else if (item.getItemId() == R.id.transactions_income) {
                aaa = 2;
            } else if (item.getItemId() == R.id.transactions_comparison) {
                aaa = 3;
            }
            vp.setCurrentItem(aaa);
            return true;
        });

        vp.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                switch (position) {
                    case 0:
                        theview.setSelectedItemId(R.id.transactions_all);
                        break;
                    case 1:
                        theview.setSelectedItemId(R.id.transactions_expense);
                        break;
                    case 2:
                        theview.setSelectedItemId(R.id.transactions_income);
                        break;
                    case 3:
                        theview.setSelectedItemId(R.id.transactions_comparison);
                        break;
                }
            }
        });


        expenseFAB.setVisibility(View.GONE);
        incomeFAB.setVisibility(View.GONE);
        expenseFABTEXT.setVisibility(View.GONE);
        incomeFABTEXT.setVisibility(View.GONE);

        isAllFabsVisible = false;
        mAddFab.shrink();
        mAddFab.setOnClickListener(
                view -> {
                    if (!isAllFabsVisible) {
                        expenseFAB.show();
                        incomeFAB.show();
                        expenseFABTEXT.setVisibility(View.VISIBLE);
                        incomeFABTEXT.setVisibility(View.VISIBLE);
                        mAddFab.extend();
                        isAllFabsVisible = true;
                    } else {
                        expenseFAB.hide();
                        incomeFAB.hide();
                        expenseFABTEXT.setVisibility(View.GONE);
                        incomeFABTEXT.setVisibility(View.GONE);
                        mAddFab.shrink();
                        isAllFabsVisible = false;
                    }
                });

        incomeFAB.setOnClickListener(
                view -> {
                    type = 0;
                    showDialog();
                });

        expenseFAB.setOnClickListener(
                view -> {
                    type = 1;
                    showDialog();
                });

        App.MainActivity_isReady = true;


        nextMonth = view.findViewById(R.id.transaction_calendar_next);
        previousMonth = view.findViewById(R.id.transaction_calendar_previous);
        selectMonth_Year = view.findViewById(R.id.transaction_calendar_select);

        selectMonth_Year.setText(month_date.format(calendar.getTime()) + "\n" + year);
        selectMonth_Year.setOnClickListener(v -> showSelectMonthYear());


        nextMonth.setOnClickListener(v -> {
            if (calendar.get(Calendar.MONTH) == Calendar.DECEMBER) {
                calendar.add(Calendar.MONTH, 1);
                calendar.add(Calendar.YEAR, 1);
                year = year + 1;
            } else {
                calendar.add(Calendar.MONTH, 1);
            }
            month = calendar.get(Calendar.MONTH) + 1;
            selectMonth_Year.setText(month_date.format(calendar.getTime()) + "\n" + year);
            update_all(requireContext());
        });

        previousMonth.setOnClickListener(v ->
        {
            if (calendar.get(Calendar.MONTH) == Calendar.JANUARY) {
                calendar.add(Calendar.MONTH, -1);
                calendar.add(Calendar.YEAR, -1);
                year = year - 1;
            } else {
                calendar.add(Calendar.MONTH, -1);
            }
            month = calendar.get(Calendar.MONTH) + 1;
            selectMonth_Year.setText(month_date.format(calendar.getTime()) + "\n" + year);
            update_all(requireContext());
        });


    }

    private void showDialog() {
        final Dialog dialog = new Dialog(requireContext());

        dialog.setTitle(R.string.add);

        dialog.setContentView(R.layout.dialog_income_expense);
        dialog.setCanceledOnTouchOutside(true);
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);


        Button save = dialog.findViewById(R.id.income_expense_save);
        Button date = dialog.findViewById(R.id.income_expense_date);
        Spinner s_type = dialog.findViewById(R.id.income_expense_type);
        EditText ien = dialog.findViewById(R.id.income_expense_name);
        EditText iea = dialog.findViewById(R.id.income_expense_amount);
        EditText desc = dialog.findViewById(R.id.income_expense_notes);
        Spinner categories = dialog.findViewById(R.id.income_expense_category);

        categories_adapter customAdapter = new categories_adapter(requireContext(), type);
        categories.setAdapter(customAdapter);

        date_tv = dialog.findViewById(R.id.income_expense_date_tv);

        showDate_Time();


        s_type.setSelection(type);
        s_type.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                type = position;
                categories.setAdapter(new categories_adapter(requireContext(), type));
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        save.setOnClickListener(v -> {
            ContentValues aaa = new ContentValues();
            aaa.put(Database.NAME_COL, ien.getText().toString());
            aaa.put(Database.AMOUNT_COL, iea.getText().toString());
            aaa.put(Database.TYPE_COL, s_type.getSelectedItemPosition());
            aaa.put("day", day);
            aaa.put("month", month);
            aaa.put("year", year);
            aaa.put("time", localizedTime);
            aaa.put(Database.DESCRIPTION_COL, desc.getText().toString());
            try {
                aaa.put(Database.CATEGORY_COL, categories_database.getNames(requireContext(), type).get(categories.getSelectedItemPosition()));
                aaa.put("category_icon", categories_database.getIcon(requireContext(), type).get(categories.getSelectedItemPosition()));
            } catch (ArrayIndexOutOfBoundsException ignored) {

            }
            Database.insert(requireContext(), "transactions", aaa);
            calendar.set(Calendar.YEAR, year);
            calendar.set(Calendar.MONTH, month - 1);
            System.out.println(month);
            System.out.println(calendar.get(Calendar.MONTH));
            calendar.set(Calendar.DAY_OF_MONTH, day);
            selectMonth_Year.setText(Filters.getMonthName(month) + "\n" + year);
            update_all(requireContext());

            dialog.dismiss();
        });

        date.setOnClickListener(v -> {

            DatePickerDialog aaa = new DatePickerDialog(requireContext(), (view, year1, month1, dayOfMonth) -> {
                year = year1;
                month = month1 + 1;
                day = dayOfMonth;
                calendar.set(Calendar.YEAR, year1);
                calendar.set(Calendar.MONTH, month1);
                calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
            }, currentCalendar.get(Calendar.YEAR), currentCalendar.get(Calendar.MONTH) + 1, currentCalendar.get(Calendar.DAY_OF_MONTH));
            TimePickerDialog timePickerDialog = new TimePickerDialog(requireContext(),
                    (view, hourOfDay, minute1) -> {
                        hour = hourOfDay;
                        minute = minute1;
                        showDate_Time();
                    }, currentCalendar.get(Calendar.HOUR), currentCalendar.get(Calendar.MINUTE), false);
            timePickerDialog.show();
            aaa.show();
        });


        dialog.show();
    }

    private void showDate_Time() {
        DateTimeZone dz = DateTimeZone.forID(TimeZone.getDefault().getID());
        String timezone = dz.getNameKey(DateTimeUtils.currentTimeMillis());

        String given_date = day + "/" + month + "/" + year;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", App.getSystemLocale());
        Date raw_date = null;
        try {
            raw_date = sdf.parse(given_date);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        SimpleDateFormat formatter = new SimpleDateFormat("ccc, dd MMMM yyyy", App.getSystemLocale());
        String localizedDate = formatter.format(raw_date);


        String given_time = hour + ":" + minute;
        SimpleDateFormat sdf1 = new SimpleDateFormat("HH:mm");
        Date raw_time = null;
        try {
            raw_time = sdf1.parse(given_time);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        localizedTime = Filters.HourMinute12_24(requireContext()).format(raw_time) + " " + timezone;


        date_tv.setText(localizedDate + " " + localizedTime);
    }

    private void showSelectMonthYear() {

        selectDialog = new Dialog(requireContext());

        selectDialog.setContentView(R.layout.dialog_transaction_selectmonthyear);
        selectDialog.setCanceledOnTouchOutside(true);
        selectDialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        selectTab = selectDialog.findViewById(R.id.select_tab_transactions);
        selectTab.setTabGravity(TabLayout.GRAVITY_FILL);

        RecyclerView rv = selectDialog.findViewById(R.id.select_transactions_recyclerview);
        FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(requireContext());
        layoutManager.setFlexDirection(FlexDirection.ROW);
        layoutManager.setJustifyContent(JustifyContent.SPACE_EVENLY);
        rv.setLayoutManager(layoutManager);

        Button cancel = selectDialog.findViewById(R.id.select_transactions_cancel);
        cancel.setOnClickListener(v -> selectDialog.dismiss());

        rv.setAdapter(new selectmonthyear_adapter(SelectMonthArray()));

        selectTab.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {

            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 1) {
                    temporaryYearisSelected = true;
                    String query_year = "select year, sum (case when type='1' then 1 else 0 end) as aa,  sum (case when type='0' then 1 else 0 end) as bb from transactions group by year";
                    Cursor thecursor = Database.getCursor(requireContext(), query_year);
                    ArrayList<SelectMonthYear> year_al = new ArrayList<>();
                    if (thecursor.moveToFirst()) {
                        do {
                            String selectedYear = thecursor.getString(0);
                            String incomes = thecursor.getString(2);
                            String expenses = thecursor.getString(1);

                            year_al.add(new SelectMonthYear(0, selectedYear, incomes, expenses));
                        }
                        while (thecursor.moveToNext());
                    }
                    thecursor.close();
                    rv.setAdapter(new selectmonthyear_adapter(year_al));


                } else {
                    rv.setAdapter(new selectmonthyear_adapter(SelectMonthArray()));
                    temporaryYearisSelected = false;
                }

            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        selectDialog.show();
    }

    private ArrayList<SelectMonthYear> SelectMonthArray() {
        int year1;
        if (!temporaryYear.equals("null")) {
            year1 = Integer.parseInt(temporaryYear);
        } else {
            year1 = year;
        }
        String query_month = "select month, sum (case when type='1' then 1 else 0 end) as aa,  sum (case when type='0' then 1 else 0 end) as bb from transactions where year = " + year1 + " group by month";
        Cursor thecursor = Database.getCursor(requireContext(), query_month);
        ArrayList<SelectMonthYear> month_al = new ArrayList<>();
        if (thecursor.moveToFirst()) {
            do {
                int month1 = thecursor.getInt(0);
                String month_name;
                month_name = Filters.getMonthName(month1);
                String incomes = thecursor.getString(2);
                String expenses = thecursor.getString(1);

                month_al.add(new SelectMonthYear(month1, month_name, incomes, expenses));
            }
            while (thecursor.moveToNext());
        }
        thecursor.close();
        return month_al;
    }
}