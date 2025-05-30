package com.softgasm.billant;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.navigation.NavigationView;
import com.softgasm.billant.databinding.ActivityMainBinding;
import com.softgasm.billant.system.App;

import java.lang.ref.WeakReference;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;

    NavController navController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        com.softgasm.billant.databinding.ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMain.toolbar);

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.calculator, R.id.commons_main)
                .setOpenableLayout(drawer)
                .build();
        navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        weakActivity = new WeakReference<>(MainActivity.this);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        if ((item.getItemId() == R.id.menu_about)) {
            navController.navigate(R.id.about);
        } else if ((item.getItemId() == R.id.privacypolicy)) {
            Uri uri = Uri.parse("https://sites.google.com/view/privacypolicyofsoftgasm/"); // missing 'http://' will cause crashed
            Intent ppintent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(ppintent);
        }
        /* TODO: TAMBAHKAN MENU SUBSCRIBE
//        else if ((item.getItemId() == R.id.menu_subscribe)) {
//            navController.navigate(R.id.subscribe);
//        }

        /* TODO: TAMBAHKAN MENU SETTINGS
        else if (item.getItemId() == R.id.action_settings) {
            navController.navigate(R.id.settings);
        } */

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }


    public static WeakReference<MainActivity> weakActivity;

    public static MainActivity getmInstanceActivity() {
        return weakActivity.get();
    }

    public void goRecreate() {
        MainActivity.this.recreate();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        App.MainActivity_isReady = false;
    }

    @Override
    protected void onStop() {
        super.onStop();
        App.MainActivity_isReady = false;
    }
}