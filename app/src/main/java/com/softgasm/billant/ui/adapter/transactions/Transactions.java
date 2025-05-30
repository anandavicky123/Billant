package com.softgasm.billant.ui.adapter.transactions;

import android.graphics.Bitmap;

public class Transactions {
   private String name, type, date, time, category, desc;
   private double amount;

   private Bitmap category_icon;




   public Transactions(String name, double amount, String type, String date, String time, String category, Bitmap category_icon, String desc) {
      this.name = name;
      this.amount = amount;
      this.type = type;
      this.date = date;
      this.time = time;
      this.category = category;
      this.category_icon = category_icon;
      this.desc = desc;
   }

   public String getName() {
      return name;
   }
   public void setName(String name) {
      this.name = name;
   }

   public double getAmount() {
      return amount;
   }
   public String getAmount_toString() {
      return String.valueOf(getAmount());
   }
   public void setAmount(double name) {
      this.amount = amount;
   }


   public String getType() {
      return type;
   }
   public void setType(String type) {
      this.type = type;
   }

   public String getDate() {
      return date;
   }
   public void setDate(String date) {
      this.date = date;
   }

   public String getTime() {
      return time;
   }
   public void setTime(String time) {
      this.time = time;
   }

   public String getCategory() {
      return category;
   }
   public void setCategory(String category) {
      this.category = category;
   }

   public Bitmap getCategoryIcon() {
      return category_icon;
   }
   public void setCategory(Bitmap category_icon) {
      this.category_icon = category_icon;
   }

   public String getDesc() {
      return desc;
   }
   public void setDesc(String desc) {
      this.desc = desc;
   }

}
