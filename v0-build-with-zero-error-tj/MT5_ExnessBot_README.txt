================================================================================
                    MT5 EXNESS BOT - INSTALLATION & USAGE GUIDE
================================================================================

OVERVIEW
--------
This is an automated Expert Advisor (EA) for MetaTrader 5 that executes a
buy-only trading strategy with strict risk management.

FEATURES
--------
✓ Buy-only trading (no sell orders)
✓ Fixed lot size: 0.6 lots
✓ Trade interval: One trade every 5 minutes
✓ Take profit: $0.60 per trade
✓ Max loss protection: 4% of initial capital
✓ Global stop: Closes all trades and stops permanently at max loss
✓ No re-entry after stop condition

================================================================================

INSTALLATION STEPS
------------------

1. LOCATE MT5 DATA FOLDER
   - Open MetaTrader 5
   - Click File → Open Data Folder
   - Navigate to: MQL5 → Experts

2. COPY THE EA FILE
   - Copy "MT5_ExnessBot.mq5" to the Experts folder

3. COMPILE THE EA
   - In MT5, open MetaEditor (F4 or Tools → MetaQuotes Language Editor)
   - Open the file: MT5_ExnessBot.mq5
   - Press F7 or click Compile
   - Ensure "0 errors, 0 warnings" appears

4. RESTART METATRADER 5
   - Close and reopen MT5 to refresh the Navigator

5. ATTACH TO CHART
   - Open a chart for your desired trading symbol
   - In Navigator (Ctrl+N), find "MT5_ExnessBot" under Expert Advisors
   - Drag and drop onto the chart OR double-click

6. CONFIGURE SETTINGS
   - In the popup dialog, adjust parameters if needed:
     * LotSize: 0.6 (default)
     * TakeProfitUSD: 0.60 (default)
     * TradeIntervalMin: 5 (default)
     * MaxLossPercent: 4.0 (default)

7. ENABLE ALGO TRADING
   - Click "OK" to attach the EA
   - Ensure "Algo Trading" button on toolbar is enabled (should be green)
   - Check that the EA shows a smiley face on the chart

================================================================================

PARAMETERS
----------

LotSize (default: 0.6)
  - Fixed lot size for each trade
  - Adjust based on your account size and margin requirements

TakeProfitUSD (default: 0.60)
  - Take profit target in USD
  - Trade closes automatically when profit reaches this amount

TradeIntervalMin (default: 5)
  - Minimum time between trades in minutes
  - Prevents overtrading

MaxLossPercent (default: 4.0)
  - Maximum allowed loss as percentage of initial capital
  - Bot stops permanently when this threshold is reached

================================================================================

RISK MANAGEMENT
---------------

The bot implements strict risk control:

1. INITIAL CAPITAL RECORDING
   - Captures account balance when EA starts
   - This is the baseline for loss calculation

2. CONTINUOUS MONITORING
   - Checks equity vs initial capital on every tick
   - Calculates real-time drawdown percentage

3. GLOBAL STOP TRIGGER
   - When loss reaches 4% of initial capital:
     a) All open positions are closed immediately
     b) Trading is permanently disabled
     c) Alert notification is sent
     d) Bot will NOT open any new trades

4. NO RECOVERY
   - Once stopped, the bot must be manually restarted
   - This prevents further losses in adverse conditions

================================================================================

TROUBLESHOOTING
---------------

"Trade context busy"
  - Wait a few seconds and the bot will retry automatically

"Invalid price"
  - Market may be closed; bot will trade when market opens

"Insufficient margin"
  - Deposit more funds or reduce lot size

"OrderSend failed"
  - Check if Algo Trading is enabled
  - Verify broker allows automated trading
  - Check internet connection

Bot not trading
  - Verify smiley face icon on chart
  - Check Algo Trading button is green
  - Review Experts tab for error messages
  - Ensure market is open

================================================================================

REQUIREMENTS
------------

- MetaTrader 5 platform
- Exness broker account
- Sufficient margin for 0.6 lot trades
- Stable internet connection
- Recommended: VPS for 24/7 operation

================================================================================

DISCLAIMER
----------

Trading involves significant risk of loss. This bot is provided "as is" without
warranty. Past performance does not guarantee future results. The user bears
full responsibility for any financial losses.

================================================================================

VERSION: 1.0
DATE: 2026

================================================================================
