package com.softgasm.billant.ui.adapter.transactions;

public class SelectMonthYear {

    private String month_year, incomes, expenses;

    private int month;


    public SelectMonthYear(int month, String month_year, String incomes, String expenses) {
        this.month_year = month_year;
        this.incomes = incomes;
        this.expenses = expenses;
        this.month = month;
    }

    public String getMonthYear() {
        return month_year;
    }

    public void setMonthYear(String month_year) {
        this.month_year = month_year;
    }

    public String getIncomes() {
        return incomes;
    }

    public void setIncomes(String incomes) {
        this.incomes = incomes;
    }

    public String getExpenses() {
        return expenses;
    }

    public void setExpenses(String expenses) {
        this.expenses = expenses;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

}
