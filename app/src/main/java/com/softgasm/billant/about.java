package com.softgasm.billant;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;


public class about extends Fragment {


    View view;
    TextView versionTV;
    ImageView instagram, twitter, linkedin, playstore;

    public about() {
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
        view = inflater.inflate(R.layout.fragment_about, container, false);
        versionTV = view.findViewById(R.id.settings_versionTV);
        instagram = view.findViewById(R.id.instagram);
        twitter = view.findViewById(R.id.twitterX);
        linkedin = view.findViewById(R.id.linkedin);
        playstore = view.findViewById(R.id.google_play);


        return view;


    }

    @Override
    public void onStart() {
        super.onStart();
        versionTV.setText(BuildConfig.VERSION_NAME);

        instagram.setOnClickListener(v -> openSNS(Uri.parse("https://www.instagram.com/softgasmofficial/"), "com.instagram.android"));
        twitter.setOnClickListener(v -> openSNS(Uri.parse("https://twitter.com/softgasm_of"), "com.twitter.android"));
        linkedin.setOnClickListener(v -> openSNS(Uri.parse("https://www.linkedin.com/company/softgasm"), "com.linkedin.android"));
        playstore.setOnClickListener(v -> openSNS(Uri.parse("https://play.google.com/store/apps/dev?id=4902046217100221951"), "android.vending"));
    }


    private void openSNS(Uri uri, String SNSpackage) {
        Intent theSNS = new Intent(Intent.ACTION_VIEW, uri);
        theSNS.setPackage(SNSpackage);

        if (isIntentAvailable(requireContext(), theSNS)) {
            startActivity(theSNS);
        } else {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(String.valueOf(uri))));
        }
    }


    private boolean isIntentAvailable(Context ctx, Intent intent) {
        final PackageManager packageManager = ctx.getPackageManager();
        List<ResolveInfo> list = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
        return list.size() > 0;
    }
}