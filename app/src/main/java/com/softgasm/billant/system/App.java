package com.softgasm.billant.system;

import static com.applovin.sdk.AppLovinSdkUtils.runOnUiThread;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.text.TextUtils;

import android.text.format.DateFormat;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.preference.PreferenceManager;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryPurchasesParams;
import com.softgasm.billant.MainActivity;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class App extends Application {

    private static Resources resources;

    public static String productid = "calculatto_adfree";

    private static final String KEY_FACTORY_ALGORITHM = "RSA";
    private static final String SIGNATURE_ALGORITHM = "SHA1withRSA";

    private static boolean alreadysave = false;

    public static boolean MainActivity_isReady = false;


    @Override
    public void onCreate() {
        super.onCreate();
        resources = getResources();
    }

    public static Resources getAppResources() {
        return resources;
    }


    public static void SavePurchaseInfo(boolean isPurchased, Context context) {
        SharedPreferences sharedpreferences = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor editor = sharedpreferences.edit();

        editor.putBoolean("sub", isPurchased);
        editor.apply();
    }

    public static boolean SubscriptionStatus(Context context) {
        SharedPreferences shared = PreferenceManager.getDefaultSharedPreferences(context);
        return shared.getBoolean("sub", false);
    }


    public static boolean verifyPurchase(String base64PublicKey, String signedData,
                                         String signature) throws IOException {
        if (TextUtils.isEmpty(signedData) || TextUtils.isEmpty(base64PublicKey)
                || TextUtils.isEmpty(signature)) {
            //Purchase verification failed: missing data
            return false;
        }

        PublicKey key = generatePublicKey(base64PublicKey);
        return verify(key, signedData, signature);
    }


    public static PublicKey generatePublicKey(String encodedPublicKey) throws IOException {
        try {
            byte[] decodedKey = Base64.decode(encodedPublicKey, Base64.DEFAULT);
            KeyFactory keyFactory = KeyFactory.getInstance(KEY_FACTORY_ALGORITHM);
            return keyFactory.generatePublic(new X509EncodedKeySpec(decodedKey));
        } catch (NoSuchAlgorithmException e) {
            // "RSA" is guaranteed to be available.
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            String msg = "Invalid key specification: " + e;
            throw new IOException(msg);
        }
    }

    public static boolean verify(PublicKey publicKey, String signedData, String signature) {
        byte[] signatureBytes;
        try {
            signatureBytes = Base64.decode(signature, Base64.DEFAULT);
        } catch (IllegalArgumentException e) {
            //Base64 decoding failed
            return false;
        }
        try {
            Signature signatureAlgorithm = Signature.getInstance(SIGNATURE_ALGORITHM);
            signatureAlgorithm.initVerify(publicKey);
            signatureAlgorithm.update(signedData.getBytes());
            //Signature verification failed
            return signatureAlgorithm.verify(signatureBytes);
        } catch (NoSuchAlgorithmException e) {
            // "RSA" is guaranteed to be available
            throw new RuntimeException(e);
        } catch (InvalidKeyException e) {
            //Invalid key specification
        } catch (SignatureException e) {
            //Signature exception
        }
        return false;
    }


    private static boolean verifyValidSignature(String signedData, String signature) {
        try {
            String base64Key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnajdN6IWXxCAcKdjBOtxjL22rQwQdy9WKD/O5fCfZHv3Ow0IxKa+rLZB5nF+6VMBoua8JVz0TzK4jGRiOG1t/zpRwkBJZ2khoktfTt3G5yEv3JCXP8pgLAkolNTpUcTxIYSm98GpfWyAIXocuuNx8Qw/aj5loUjlXu06FOuRws0wVfujn8mJdmBdccOOLhc4mH+/NFmtDU1I0PfeRgIMTagjy/UkY9koqz0veYNe0xNT/pO927BYBf/NPBvz3ualmsHRW8Py2hx0IF9wfjclsx8btHNxVKAgdgtqzLPr20CvDBH0y+PZJqiNjDvuupJNzBymarjeYVsOYFjgas2MuQIDAQAB";

            return verifyPurchase(base64Key, signedData, signature);
        } catch (IOException e) {
            return false;
        }
    }


    public static void handlePurchases(Context context, Purchase purchase, List<ProductDetails> thelist, BillingClient billingClient) {
        if (productid.equals(thelist.get(0).getProductId()) && purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            if (!verifyValidSignature(purchase.getOriginalJson(), purchase.getSignature())) {
                // Invalid purchase
                // show error to user
                runOnUiThread(() -> {
                    Toast.makeText(context, "Error : invalid Purchase", Toast.LENGTH_SHORT).show();
                });

                return;
            }
            // else purchase is valid
            //if item is purchased and not acknowledged
            if (!purchase.isAcknowledged()) {
                AcknowledgePurchaseParams acknowledgePurchaseParams =
                        AcknowledgePurchaseParams.newBuilder()
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();
                billingClient.acknowledgePurchase(acknowledgePurchaseParams, billingResult -> {
                    runOnUiThread(() -> {
                        startSaving(context);
                    });
                });
            } else {
                runOnUiThread(() -> {
                    startSaving(context);
                });
            }
        }
        //if purchase is pending
        else if (productid.equals(thelist.get(0).getProductId()) && purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) {
            runOnUiThread(() -> {
                Toast.makeText(context,
                        "Purchase is Pending. Please complete Transaction", Toast.LENGTH_SHORT).show();
            });

        }
        //if purchase is unknown mark false
        else if (productid.equals(thelist.get(0).getProductId()) && purchase.getPurchaseState() == Purchase.PurchaseState.UNSPECIFIED_STATE) {
            SavePurchaseInfo(false, context);
            runOnUiThread(() -> {
                Toast.makeText(context, "Purchase Status Unknown", Toast.LENGTH_SHORT).show();
            });

        }
    }


    public static void CheckSubscription(Context context) {
        BillingClient billingClient = BillingClient.newBuilder(context).enablePendingPurchases().setListener((billingResult, list) -> {
        }).build();
        final BillingClient finalBillingClient = billingClient;
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingServiceDisconnected() {

            }

            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {

                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    finalBillingClient.queryPurchasesAsync(
                            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(), (billingResult1, list) -> {
                                if (billingResult1.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                                    Log.d("testOffer", list.size() + " size");
                                    if (list.size() > 0) {
                                        for (Purchase purchase : list) {
                                            SavePurchaseInfo(true, context);
                                            MainActivity.getmInstanceActivity().goRecreate();
                                        }
                                    } else {
                                        SavePurchaseInfo(false, context);
                                    }
                                }
                            });
                }
            }
        });
    }


    public static void startSaving(Context context) {
        if (!alreadysave) {
            SavePurchaseInfo(true, context);
            Toast.makeText(context, "Item Purchased", Toast.LENGTH_SHORT).show();
            MainActivity.getmInstanceActivity().goRecreate();
            alreadysave = true;
        }
    }

    public static Locale getSystemLocale() {
        return new Locale(Locale.getDefault().getLanguage(), Locale.getDefault().getCountry());
    }

}