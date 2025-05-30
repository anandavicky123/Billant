package com.softgasm.billant;

import static com.applovin.sdk.AppLovinSdkUtils.runOnUiThread;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.softgasm.billant.system.App;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@SuppressLint("SetTextI18n")
public class subscribe extends Fragment {

    CardView amonth, sixmonths;
    Button iap;
    private BillingClient billingClient;

    TextView onemonthprice, sixmonthsprice, sixmonthop, sub_status;

    List<ProductDetails> thelist;

    public subscribe() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    View view;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_subscribe, container, false);

        amonth = view.findViewById(R.id.onemonthplan);
        sixmonths = view.findViewById(R.id.sixmonthplan);
        onemonthprice = view.findViewById(R.id.onemonthprice);
        sixmonthsprice = view.findViewById(R.id.sixmonthsprice);
        sixmonthop = view.findViewById(R.id.sixmonthsoriginalprice);
        iap = view.findViewById(R.id.iapbutton);
        sub_status = view.findViewById(R.id.tv_sub_status);

        billingClient = BillingClient.newBuilder(requireContext())
                .enablePendingPurchases()
                .setListener(
                        (billingResult, list) -> {
                            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && list != null) {
                                for (Purchase purchase : list) {
                                    verifySubPurchase(purchase);
                                }
                            }
                        }
                ).build();

        establishConnection();
        tv_status();

        amonth.setOnClickListener(v -> {
            LaunchSubPurchase(thelist.get(0), 1);
        });
        sixmonths.setOnClickListener(v -> {
            LaunchSubPurchase(thelist.get(0), 0);
        });
        iap.setOnClickListener(v -> {
            App.CheckSubscription(requireContext());
            tv_status();
        });




        return view;
    }

    private void tv_status(){
        if (App.SubscriptionStatus(requireContext())){
            sub_status.setText(getString(R.string.status) + ": " + getString(R.string.purchased));
            sub_status.setTextColor(Color.GREEN);
        } else {
            sub_status.setText(getString(R.string.status) + ": " + getString(R.string.notpurchased));
            sub_status.setTextColor(Color.RED);
        }
    }

    void establishConnection() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    // The BillingClient is ready. You can query purchases here.
                    //Use any of function below to get details upon successful connection
                    ArrayList<QueryProductDetailsParams.Product> productList = new ArrayList<>();

                    productList.add(
                            QueryProductDetailsParams.Product.newBuilder()
                                    .setProductId(App.productid)
                                    .setProductType(BillingClient.ProductType.SUBS)
                                    .build()
                    );

                    QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                            .setProductList(productList)
                            .build();


                    billingClient.queryProductDetailsAsync(params, (billingResult1, list) -> {
                        thelist = list;
                        runOnUiThread(() -> {
                            String omonth = thelist.get(0).getSubscriptionOfferDetails().get(1).getPricingPhases().getPricingPhaseList().get(0).getFormattedPrice();
                           String currencies = thelist.get(0).getSubscriptionOfferDetails().get(1).getPricingPhases().getPricingPhaseList().get(0).getPriceCurrencyCode();
                          onemonthprice.setText(omonth);
                           long smop = thelist.get(0).getSubscriptionOfferDetails().get(1).getPricingPhases().getPricingPhaseList().get(0).getPriceAmountMicros() * 6 / 1000000;
                           DecimalFormat currencyformatter = new DecimalFormat("###,###.###");
                            sixmonthop.setText(currencies + " " + currencyformatter.format(smop));
                           String sixmonth = thelist.get(0).getSubscriptionOfferDetails().get(0).getPricingPhases().getPricingPhaseList().get(0).getFormattedPrice();
                           sixmonthsprice.setText(sixmonth);
                        sixmonthop.setPaintFlags(sixmonthop.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
                       });
                    });
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Try to restart the connection on the next request to
                // Google Play by calling the startConnection() method.
                Log.d("TAG", "Connection NOT Established");
                establishConnection();
            }
        });
    }


    void LaunchSubPurchase(ProductDetails productDetails, int offer) {
        assert productDetails.getSubscriptionOfferDetails() != null;
        ArrayList<BillingFlowParams.ProductDetailsParams> productList = new ArrayList<>();

        productList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(productDetails.getSubscriptionOfferDetails().get(offer).getOfferToken())
                        .build()
        );

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productList)
                .build();

        billingClient.launchBillingFlow(requireActivity(), billingFlowParams);
    }

    void verifySubPurchase(Purchase purchases) {

       runOnUiThread(() -> {
           Toast.makeText(requireContext(), R.string.pleasewait, Toast.LENGTH_SHORT).show();
               });

        AcknowledgePurchaseParams acknowledgePurchaseParams = AcknowledgePurchaseParams
                .newBuilder()
                .setPurchaseToken(purchases.getPurchaseToken())
                .build();

        billingClient.acknowledgePurchase(acknowledgePurchaseParams, billingResult -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                App.handlePurchases(requireContext(), purchases, thelist, billingClient);

            }
        });
    }




    @Override
    public void onResume() {
        super.onResume();

        billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
                (billingResult, list) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        for (Purchase purchase : list) {
                            if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED && !purchase.isAcknowledged()) {
                                verifySubPurchase(purchase);
                            }
                        }
                    }
                }
        );
    }
}