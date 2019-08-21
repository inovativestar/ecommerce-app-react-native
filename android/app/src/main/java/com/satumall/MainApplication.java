package com.satumall;

import android.app.Application;

import com.facebook.react.ReactApplication;
//import com.oblador.vectoricons.VectorIconsPackage;
//import com.reactnativenavigation.NavigationReactPackage;
//import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.ipay88.IPay88Package;
import com.rnprogresshud.RNProgressHUDPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
//            new VectorIconsPackage(),
  //          new NavigationReactPackage(),
  //          new RNDeviceInfo(),
            new FastImageViewPackage(),
            new IPay88Package(),
            new RNProgressHUDPackage(),
            
            new PickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
