package com.satumall;

import com.facebook.react.ReactActivity;
import com.ipay88.IPay88Package;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        new IPay88Package();
        return "satumall";
    }
  
  /**
   @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNIPay88Package()
      );
    }
   */
   
}
