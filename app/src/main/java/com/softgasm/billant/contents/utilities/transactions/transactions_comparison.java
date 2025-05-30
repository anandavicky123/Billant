package com.softgasm.billant.contents.utilities.transactions;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SeekBar;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;
import com.softgasm.billant.R;


public class transactions_comparison extends Fragment implements SeekBar.OnSeekBarChangeListener,
        OnChartGestureListener, OnChartValueSelectedListener {

    View view;

    LineChart annualReport;
    XAxis LineX;
    YAxis LineY;

    public transactions_comparison() {
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
        view = inflater.inflate(R.layout.fragment_transactions_summary, container, false);




//        annualReport = view.findViewById(R.id.comparison_linechart);
//        annualReport.setTouchEnabled(true);
//        annualReport.setPinchZoom(true);
//        LineX = annualReport.getXAxis();
//        LineY = annualReport.getAxisLeft();
//        XAxis.XAxisPosition position = XAxis.XAxisPosition.BOTTOM;
//        LineX.setPosition(position);
//        annualReport.getDescription().setEnabled(true);
//        Description description = new Description();
//
//        description.setText(getString(R.string.months));
//        description.setTextSize(10f);
//
//
//        final ArrayList<String> xAxisLabel = new ArrayList<>();
//        xAxisLabel.add(Filters.getMonthName(1));
//        xAxisLabel.add(Filters.getMonthName(2));
//        xAxisLabel.add(Filters.getMonthName(3));
//        xAxisLabel.add(Filters.getMonthName(4));
//        xAxisLabel.add(Filters.getMonthName(5));
//        xAxisLabel.add(Filters.getMonthName(6));
//        xAxisLabel.add(Filters.getMonthName(7));
//        xAxisLabel.add(Filters.getMonthName(8));
//        xAxisLabel.add(Filters.getMonthName(9));
//        xAxisLabel.add(Filters.getMonthName(10));
//        xAxisLabel.add(Filters.getMonthName(11));
//        xAxisLabel.add(Filters.getMonthName(12));


        return view;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {

    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onChartGestureStart(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

    }

    @Override
    public void onChartGestureEnd(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

    }

    @Override
    public void onChartLongPressed(MotionEvent me) {

    }

    @Override
    public void onChartDoubleTapped(MotionEvent me) {

    }

    @Override
    public void onChartSingleTapped(MotionEvent me) {

    }

    @Override
    public void onChartFling(MotionEvent me1, MotionEvent me2, float velocityX, float velocityY) {

    }

    @Override
    public void onChartScale(MotionEvent me, float scaleX, float scaleY) {

    }

    @Override
    public void onChartTranslate(MotionEvent me, float dX, float dY) {

    }

    @Override
    public void onValueSelected(Entry e, Highlight h) {

    }

    @Override
    public void onNothingSelected() {

    }
}