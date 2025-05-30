package com.softgasm.billant;

import android.os.Bundle;

import androidx.preference.PreferenceFragmentCompat;

public class settings extends PreferenceFragmentCompat {

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        setPreferencesFromResource(R.xml.root_preferences, rootKey);
    }
}