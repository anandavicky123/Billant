package com.softgasm.billant.system;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.softgasm.billant.R;
import com.softgasm.billant.ui.adapter.categories.Categories;

import java.util.ArrayList;

public class Database extends SQLiteOpenHelper {

    Context thecontext;
    public Database(Context context) {
        super(context, "database.db", null, 1);
        thecontext = context;
    }

    public static final String ID_COL = "id";
    public static final String NAME_COL = "name";
    public static final String DESCRIPTION_COL = "description";
    public static final String AMOUNT_COL = "amount";
    public static final String CATEGORY_COL = "category";
    public static final String TYPE_COL = "type";
    public static final String ICON_COL = "icon";


    @Override
    public void onCreate(SQLiteDatabase db) {

        //transactions
        String transactions_query = "CREATE TABLE IF NOT EXISTS " + "transactions" + " ("
                + ID_COL + " INTEGER PRIMARY KEY AUTOINCREMENT, "
                + NAME_COL + " TEXT,"
                + TYPE_COL + " INTEGER,"
                + AMOUNT_COL + " DOUBLE,"
                + CATEGORY_COL + " TEXT,"
                + DESCRIPTION_COL + " TEXT,"
                + "day" + " int,"
                + "month" + " int,"
                + "year" + " int,"
                + "time" + " text,"
                + "category_icon" + " MEDIUMBLOB)";
        db.execSQL(transactions_query);

        //category of transactions
        String categories_query = "CREATE TABLE IF NOT EXISTS " + "categories" + " ("
                + ID_COL + " INTEGER PRIMARY KEY AUTOINCREMENT, "
                + NAME_COL + " TEXT,"
                + TYPE_COL + " INTEGER,"
                + ICON_COL + " MEDIUMBLOB)";
        db.execSQL(categories_query);

        if (App.MainActivity_isReady){
            ArrayList<Categories> default_categories = new ArrayList<>();
            default_categories.add(new Categories(thecontext, "Salary", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Wage", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Sales", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Rental Services", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Gift", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Holiday Allowance", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Donation", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Savings Withdrawal", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Others", 0, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Food & Drink", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Rent", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Bills", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Transportation", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Gas", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Parking", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Goods", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Travel", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Pets", 1, R.drawable.softgasm));
            default_categories.add(new Categories(thecontext, "Others", 1, R.drawable.softgasm));
            for (int i = 0; i < default_categories.size(); i++) {
                ContentValues values = new ContentValues();
                values.put(NAME_COL, default_categories.get(i).getName());
                values.put(TYPE_COL, default_categories.get(i).getType());
                values.put(ICON_COL, default_categories.get(i).getRawBitmap());
                db.insert("categories", "NO_COLUMN_NAME", values);
            }
        }

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }

    public static void insert(Context context, String table_name, ContentValues values) {
        SQLiteDatabase db = new Database(context).getWritableDatabase();
        db.insert(table_name, "NO_COLUMN_NAME", values);
        db.close();
    }

    public static Cursor getCursor(Context context, String query) {
        SQLiteDatabase db = new Database(context).getReadableDatabase();
        return db.rawQuery(query, null);
    }
}
