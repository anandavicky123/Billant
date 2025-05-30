package com.softgasm.billant.system;


import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.text.format.DateFormat;

import androidx.annotation.DrawableRes;
import androidx.appcompat.content.res.AppCompatResources;

import com.ibm.icu.text.RuleBasedNumberFormat;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class Filters {


    public static String number_toWords(Double number) {
        Locale local = App.getSystemLocale();
        RuleBasedNumberFormat ruleBasedNumberFormat = new RuleBasedNumberFormat(local, RuleBasedNumberFormat.SPELLOUT);
        return ruleBasedNumberFormat.format(number);
    }

    public static String simplifiednumbers(Double number) {
        char[] suffix = {' ', 'k', 'M', 'B', 'T', 'P', 'E'};
        long numValue = number.longValue();
        int value = (int) Math.floor(Math.log10(numValue));
        int base = value / 3;
        if (value >= 3 && base < suffix.length) {
            return new DecimalFormat("#0.0").format(numValue / Math.pow(10, base * 3)) + suffix[base];
        } else {
            return new DecimalFormat("#,##0").format(numValue);
        }
    }


    public static Bitmap getBitmap(ArrayList<byte[]> raw_icons, int position) {
        byte[] raw_byte = raw_icons.get(position);
        return BitmapFactory.decodeByteArray(raw_byte, 0, raw_byte.length);
    }

    public static Bitmap BlobToBitmap(byte[] raw_icons) {
        return BitmapFactory.decodeByteArray(raw_icons, 0, raw_icons.length);
    }

    public static byte[] DrawableToByte(Context context, @DrawableRes int drawable) {
        Drawable my_drawable = AppCompatResources.getDrawable(context, drawable);
        Bitmap bitmap = ((BitmapDrawable) my_drawable).getBitmap();
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 50, stream);
        return stream.toByteArray();
    }

    public static String LocaleDate(Context context, int day, int month, int year) {
        Format dateFormat = android.text.format.DateFormat.getDateFormat(context);
        String system_date_pattern = ((SimpleDateFormat) dateFormat).toLocalizedPattern();
        String given_date = day + "/" + month + "/" + year;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", App.getSystemLocale());
        Date raw_date = null;
        try {
            raw_date = sdf.parse(given_date);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        SimpleDateFormat formatter = new SimpleDateFormat(system_date_pattern, App.getSystemLocale());
        return formatter.format(raw_date);
    }

    public static SimpleDateFormat HourMinute12_24(Context context) {
        String timeSeparator = ":";
        String country = App.getAppResources().getConfiguration().getLocales().get(0).getCountry();
        switch (country) {
            case "ID":
            case "FI":
                timeSeparator = ".";
                break;
            case "VN":
            case "FR":
                timeSeparator = "h";
                break;
        }

        if (DateFormat.is24HourFormat(context)) {
            return new SimpleDateFormat("HH" + timeSeparator + "mm");
        } else {
            return new SimpleDateFormat("hh" + timeSeparator + "mm a");
        }
    }

    public static String getMonthName(int MonthIndex) {
        return Month.of(MonthIndex).getDisplayName(TextStyle.FULL, App.getSystemLocale());
    }
}
