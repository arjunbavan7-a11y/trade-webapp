//+------------------------------------------------------------------+
//|                                              MT5_ExnessBot.mq5   |
//|                        Automated Trading Bot for Exness          |
//|                        Buy-Only Strategy with Risk Management    |
//|                        WITH WEB DASHBOARD API INTEGRATION        |
//+------------------------------------------------------------------+
#property copyright "Trading Bot Development"
#property link      ""
#property version   "2.00"
#property strict

//+------------------------------------------------------------------+
//| Input Parameters                                                  |
//+------------------------------------------------------------------+
input double   LotSize           = 0.6;      // Fixed Lot Size
input double   TakeProfitUSD     = 0.60;     // Take Profit in USD
input int      TradeIntervalMin  = 5;        // Trade Interval in Minutes
input double   MaxLossPercent    = 4.0;      // Maximum Loss Percentage of Initial Capital

// API Configuration
input string   ApiBaseUrl        = "https://your-app.vercel.app";  // Your Vercel Dashboard URL
input string   ApiKey            = "";       // API Key for authentication
input string   ClientId          = "c1";     // Unique Client ID for this account
input int      ApiUpdateSeconds  = 30;       // How often to send updates to API (seconds)

//+------------------------------------------------------------------+
//| Global Variables                                                  |
//+------------------------------------------------------------------+
double         InitialCapital;               // Initial capital at EA startup
double         MaxLossAmount;                // Maximum allowed loss amount
datetime       LastTradeTime;                // Time of last trade
datetime       LastApiUpdate;                // Time of last API update
bool           TradingEnabled;               // Flag to control trading state
int            MagicNumber = 123456;         // Unique identifier for this EA's trades

// Trade statistics
int            TotalTrades = 0;
int            WinningTrades = 0;
int            LosingTrades = 0;
double         TodayProfit = 0;
datetime       TodayStart;

//+------------------------------------------------------------------+
//| Expert initialization function                                    |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- Record initial capital at startup
   InitialCapital = AccountInfoDouble(ACCOUNT_BALANCE);
   
   //--- Calculate maximum loss amount (4% of initial capital)
   MaxLossAmount = InitialCapital * (MaxLossPercent / 100.0);
   
   //--- Initialize trading state
   TradingEnabled = true;
   LastTradeTime = 0;
   LastApiUpdate = 0;
   TodayStart = TimeCurrent();
   
   //--- Display initialization info
   Print("========================================");
   Print("MT5 Exness Bot v2.0 Initialized");
   Print("Initial Capital: ", DoubleToString(InitialCapital, 2));
   Print("Max Loss Amount (", MaxLossPercent, "%): ", DoubleToString(MaxLossAmount, 2));
   Print("Lot Size: ", LotSize);
   Print("Take Profit: $", TakeProfitUSD);
   Print("Trade Interval: ", TradeIntervalMin, " minutes");
   Print("API URL: ", ApiBaseUrl);
   Print("Client ID: ", ClientId);
   Print("========================================");
   
   //--- Validation checks
   if(LotSize <= 0)
   {
      Print("Error: Invalid lot size");
      return(INIT_PARAMETERS_INCORRECT);
   }
   
   if(InitialCapital <= 0)
   {
      Print("Error: Unable to retrieve account balance");
      return(INIT_FAILED);
   }
   
   //--- Send initial status to API
   SendBotStatusToApi();
   
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                  |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   //--- Send final status update
   SendBotStatusToApi();
   Print("MT5 Exness Bot Stopped. Reason: ", reason);
}

//+------------------------------------------------------------------+
//| Expert tick function                                              |
//+------------------------------------------------------------------+
void OnTick()
{
   //--- Periodic API updates
   if(TimeCurrent() - LastApiUpdate >= ApiUpdateSeconds)
   {
      SendBotStatusToApi();
      LastApiUpdate = TimeCurrent();
   }
   
   //--- Check if trading is still enabled
   if(!TradingEnabled)
   {
      return;
   }
   
   //--- Check for max loss condition
   if(CheckMaxLoss())
   {
      ExecuteGlobalStop();
      return;
   }
   
   //--- Check open positions for take profit
   CheckTakeProfit();
   
   //--- Check if it's time for a new trade
   if(CanOpenNewTrade())
   {
      OpenBuyTrade();
   }
}

//+------------------------------------------------------------------+
//| Send bot status to web dashboard API                              |
//+------------------------------------------------------------------+
void SendBotStatusToApi()
{
   if(StringLen(ApiBaseUrl) == 0)
   {
      return;
   }
   
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double profit = balance - InitialCapital;
   double profitPercent = (profit / InitialCapital) * 100;
   double maxDrawdown = (InitialCapital - equity) / InitialCapital * 100;
   if(maxDrawdown < 0) maxDrawdown = 0;
   
   double winRate = TotalTrades > 0 ? (double)WinningTrades / TotalTrades * 100 : 0;
   
   string status = "running";
   if(!TradingEnabled) status = "stopped";
   
   //--- Build JSON payload
   string json = "{";
   json += "\"clientId\":\"" + ClientId + "\",";
   json += "\"accountNumber\":\"" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "\",";
   json += "\"symbol\":\"" + _Symbol + "\",";
   json += "\"status\":\"" + status + "\",";
   json += "\"initialCapital\":" + DoubleToString(InitialCapital, 2) + ",";
   json += "\"currentBalance\":" + DoubleToString(balance, 2) + ",";
   json += "\"profit\":" + DoubleToString(profit, 2) + ",";
   json += "\"profitPercentage\":" + DoubleToString(profitPercent, 2) + ",";
   json += "\"totalTrades\":" + IntegerToString(TotalTrades) + ",";
   json += "\"winningTrades\":" + IntegerToString(WinningTrades) + ",";
   json += "\"losingTrades\":" + IntegerToString(LosingTrades) + ",";
   json += "\"winRate\":" + DoubleToString(winRate, 2) + ",";
   json += "\"maxDrawdown\":" + DoubleToString(maxDrawdown, 2) + ",";
   json += "\"todayProfit\":" + DoubleToString(TodayProfit, 2) + ",";
   json += "\"lotSize\":" + DoubleToString(LotSize, 2) + ",";
   json += "\"takeProfitUSD\":" + DoubleToString(TakeProfitUSD, 2) + ",";
   json += "\"maxLossPercentage\":" + DoubleToString(MaxLossPercent, 2) + ",";
   json += "\"lastTradeTime\":\"" + TimeToString(LastTradeTime, TIME_DATE | TIME_SECONDS) + "\"";
   json += "}";
   
   //--- Send HTTP POST request
   string url = ApiBaseUrl + "/api/bots";
   string headers = "Content-Type: application/json\r\n";
   if(StringLen(ApiKey) > 0)
   {
      headers += "x-api-key: " + ApiKey + "\r\n";
   }
   
   char postData[];
   char result[];
   string resultHeaders;
   
   StringToCharArray(json, postData, 0, StringLen(json));
   ArrayResize(postData, StringLen(json));
   
   int timeout = 5000;
   int res = WebRequest("POST", url, headers, timeout, postData, result, resultHeaders);
   
   if(res == -1)
   {
      int error = GetLastError();
      if(error == 4014)
      {
         Print("API Error: Add URL to allowed list in Tools > Options > Expert Advisors");
         Print("Add: ", ApiBaseUrl);
      }
      else
      {
         Print("API Error: ", error);
      }
   }
   else
   {
      Print("API Update sent successfully");
   }
}

//+------------------------------------------------------------------+
//| Send trade to web dashboard API                                   |
//+------------------------------------------------------------------+
void SendTradeToApi(ulong ticket, string tradeStatus, double tradeProfit = 0)
{
   if(StringLen(ApiBaseUrl) == 0)
   {
      return;
   }
   
   if(!PositionSelectByTicket(ticket))
   {
      return;
   }
   
   double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
   double closePrice = tradeStatus == "closed" ? PositionGetDouble(POSITION_PRICE_CURRENT) : 0;
   datetime openTime = (datetime)PositionGetInteger(POSITION_TIME);
   
   //--- Build JSON payload
   string json = "{";
   json += "\"ticket\":" + IntegerToString(ticket) + ",";
   json += "\"clientId\":\"" + ClientId + "\",";
   json += "\"botId\":\"bot-" + ClientId + "\",";
   json += "\"symbol\":\"" + _Symbol + "\",";
   json += "\"type\":\"BUY\",";
   json += "\"lotSize\":" + DoubleToString(LotSize, 2) + ",";
   json += "\"openPrice\":" + DoubleToString(openPrice, 2) + ",";
   if(tradeStatus == "closed")
   {
      json += "\"closePrice\":" + DoubleToString(closePrice, 2) + ",";
      json += "\"profit\":" + DoubleToString(tradeProfit, 2) + ",";
      json += "\"closeTime\":\"" + TimeToString(TimeCurrent(), TIME_DATE | TIME_SECONDS) + "\",";
   }
   json += "\"status\":\"" + tradeStatus + "\",";
   json += "\"openTime\":\"" + TimeToString(openTime, TIME_DATE | TIME_SECONDS) + "\",";
   json += "\"takeProfitPrice\":" + DoubleToString(openPrice + 1, 2);
   json += "}";
   
   //--- Send HTTP POST request
   string url = ApiBaseUrl + "/api/trades";
   string headers = "Content-Type: application/json\r\n";
   if(StringLen(ApiKey) > 0)
   {
      headers += "x-api-key: " + ApiKey + "\r\n";
   }
   
   char postData[];
   char result[];
   string resultHeaders;
   
   StringToCharArray(json, postData, 0, StringLen(json));
   ArrayResize(postData, StringLen(json));
   
   int timeout = 5000;
   WebRequest("POST", url, headers, timeout, postData, result, resultHeaders);
}

//+------------------------------------------------------------------+
//| Send alert to web dashboard API                                   |
//+------------------------------------------------------------------+
void SendAlertToApi(string alertType, string title, string message)
{
   if(StringLen(ApiBaseUrl) == 0)
   {
      return;
   }
   
   //--- Build JSON payload
   string json = "{";
   json += "\"type\":\"" + alertType + "\",";
   json += "\"title\":\"" + title + "\",";
   json += "\"message\":\"" + message + "\",";
   json += "\"clientId\":\"" + ClientId + "\",";
   json += "\"botId\":\"bot-" + ClientId + "\"";
   json += "}";
   
   //--- Send HTTP POST request
   string url = ApiBaseUrl + "/api/alerts";
   string headers = "Content-Type: application/json\r\n";
   if(StringLen(ApiKey) > 0)
   {
      headers += "x-api-key: " + ApiKey + "\r\n";
   }
   
   char postData[];
   char result[];
   string resultHeaders;
   
   StringToCharArray(json, postData, 0, StringLen(json));
   ArrayResize(postData, StringLen(json));
   
   int timeout = 5000;
   WebRequest("POST", url, headers, timeout, postData, result, resultHeaders);
}

//+------------------------------------------------------------------+
//| Check if maximum loss has been reached                           |
//+------------------------------------------------------------------+
bool CheckMaxLoss()
{
   double currentEquity = AccountInfoDouble(ACCOUNT_EQUITY);
   double currentLoss = InitialCapital - currentEquity;
   
   if(currentLoss >= MaxLossAmount)
   {
      Print("WARNING: Maximum loss threshold reached!");
      Print("Initial Capital: ", DoubleToString(InitialCapital, 2));
      Print("Current Equity: ", DoubleToString(currentEquity, 2));
      Print("Current Loss: ", DoubleToString(currentLoss, 2));
      Print("Max Loss Allowed: ", DoubleToString(MaxLossAmount, 2));
      return true;
   }
   
   return false;
}

//+------------------------------------------------------------------+
//| Execute global stop - close all trades and disable trading       |
//+------------------------------------------------------------------+
void ExecuteGlobalStop()
{
   Print("========================================");
   Print("GLOBAL STOP ACTIVATED");
   Print("Closing all positions...");
   
   //--- Send alert to API
   SendAlertToApi("error", "Max Loss Reached", "Bot stopped due to reaching " + DoubleToString(MaxLossPercent, 1) + "% max loss");
   
   //--- Close all open positions
   CloseAllPositions();
   
   //--- Disable trading permanently
   TradingEnabled = false;
   
   //--- Send final status update
   SendBotStatusToApi();
   
   Print("Trading has been PERMANENTLY DISABLED");
   Print("Bot will not open any new trades");
   Print("========================================");
   
   //--- Alert user
   Alert("MT5 Exness Bot: GLOBAL STOP - 4% loss reached. Trading disabled.");
}

//+------------------------------------------------------------------+
//| Close all open positions                                          |
//+------------------------------------------------------------------+
void CloseAllPositions()
{
   int totalPositions = PositionsTotal();
   
   for(int i = totalPositions - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      
      if(ticket > 0)
      {
         if(PositionSelectByTicket(ticket))
         {
            //--- Only close positions opened by this EA
            if(PositionGetInteger(POSITION_MAGIC) == MagicNumber)
            {
               string symbol = PositionGetString(POSITION_SYMBOL);
               double volume = PositionGetDouble(POSITION_VOLUME);
               ENUM_POSITION_TYPE posType = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
               
               MqlTradeRequest request;
               MqlTradeResult result;
               ZeroMemory(request);
               ZeroMemory(result);
               
               request.action = TRADE_ACTION_DEAL;
               request.position = ticket;
               request.symbol = symbol;
               request.volume = volume;
               request.deviation = 10;
               request.magic = MagicNumber;
               
               //--- For buy positions, we sell to close
               if(posType == POSITION_TYPE_BUY)
               {
                  request.type = ORDER_TYPE_SELL;
                  request.price = SymbolInfoDouble(symbol, SYMBOL_BID);
               }
               
               if(OrderSend(request, result))
               {
                  Print("Position closed: Ticket #", ticket);
               }
               else
               {
                  Print("Failed to close position: Ticket #", ticket, " Error: ", GetLastError());
               }
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Check if we can open a new trade                                  |
//+------------------------------------------------------------------+
bool CanOpenNewTrade()
{
   //--- Check if enough time has passed since last trade
   datetime currentTime = TimeCurrent();
   int secondsElapsed = (int)(currentTime - LastTradeTime);
   int requiredSeconds = TradeIntervalMin * 60;
   
   if(secondsElapsed < requiredSeconds)
   {
      return false;
   }
   
   //--- Check if market is open
   if(!IsMarketOpen())
   {
      return false;
   }
   
   return true;
}

//+------------------------------------------------------------------+
//| Check if market is open for trading                               |
//+------------------------------------------------------------------+
bool IsMarketOpen()
{
   MqlDateTime dt;
   TimeCurrent(dt);
   
   //--- Get symbol trading session info
   datetime from, to;
   if(!SymbolInfoSessionTrade(_Symbol, (ENUM_DAY_OF_WEEK)dt.day_of_week, 0, from, to))
   {
      return false;
   }
   
   //--- Check spread (if spread is 0, market might be closed)
   double spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   if(spread <= 0)
   {
      return false;
   }
   
   return true;
}

//+------------------------------------------------------------------+
//| Open a BUY trade                                                  |
//+------------------------------------------------------------------+
void OpenBuyTrade()
{
   string symbol = _Symbol;
   double price = SymbolInfoDouble(symbol, SYMBOL_ASK);
   
   //--- Validate price
   if(price <= 0)
   {
      Print("Error: Invalid price");
      return;
   }
   
   //--- Check if we have enough margin
   double marginRequired;
   if(!OrderCalcMargin(ORDER_TYPE_BUY, symbol, LotSize, price, marginRequired))
   {
      Print("Error: Unable to calculate margin");
      return;
   }
   
   double freeMargin = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
   if(freeMargin < marginRequired)
   {
      Print("Error: Insufficient margin. Required: ", marginRequired, " Available: ", freeMargin);
      return;
   }
   
   //--- Prepare trade request
   MqlTradeRequest request;
   MqlTradeResult result;
   ZeroMemory(request);
   ZeroMemory(result);
   
   request.action = TRADE_ACTION_DEAL;
   request.symbol = symbol;
   request.volume = LotSize;
   request.type = ORDER_TYPE_BUY;
   request.price = price;
   request.deviation = 10;
   request.magic = MagicNumber;
   request.comment = "MT5 Exness Bot BUY";
   request.type_filling = ORDER_FILLING_IOC;
   
   //--- Send the order
   if(OrderSend(request, result))
   {
      if(result.retcode == TRADE_RETCODE_DONE || result.retcode == TRADE_RETCODE_PLACED)
      {
         LastTradeTime = TimeCurrent();
         TotalTrades++;
         
         Print("BUY order opened successfully!");
         Print("Ticket: ", result.order);
         Print("Price: ", price);
         Print("Lot Size: ", LotSize);
         Print("Target Profit: $", TakeProfitUSD);
         
         //--- Send trade to API
         SendTradeToApi(result.order, "open");
         SendBotStatusToApi();
      }
      else
      {
         Print("Order placed but returned code: ", result.retcode);
      }
   }
   else
   {
      Print("Failed to open BUY order. Error: ", GetLastError());
      Print("Return code: ", result.retcode);
   }
}

//+------------------------------------------------------------------+
//| Check positions for take profit condition                         |
//+------------------------------------------------------------------+
void CheckTakeProfit()
{
   int totalPositions = PositionsTotal();
   
   for(int i = totalPositions - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      
      if(ticket > 0)
      {
         if(PositionSelectByTicket(ticket))
         {
            //--- Only manage positions opened by this EA
            if(PositionGetInteger(POSITION_MAGIC) == MagicNumber)
            {
               double profit = PositionGetDouble(POSITION_PROFIT);
               double swap = PositionGetDouble(POSITION_SWAP);
               double totalProfit = profit + swap;
               
               //--- Check if take profit target reached ($0.60)
               if(totalProfit >= TakeProfitUSD)
               {
                  ClosePosition(ticket, totalProfit);
               }
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Close a specific position                                         |
//+------------------------------------------------------------------+
void ClosePosition(ulong ticket, double profit)
{
   if(!PositionSelectByTicket(ticket))
   {
      Print("Error: Unable to select position for closing");
      return;
   }
   
   string symbol = PositionGetString(POSITION_SYMBOL);
   double volume = PositionGetDouble(POSITION_VOLUME);
   ENUM_POSITION_TYPE posType = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
   
   MqlTradeRequest request;
   MqlTradeResult result;
   ZeroMemory(request);
   ZeroMemory(result);
   
   request.action = TRADE_ACTION_DEAL;
   request.position = ticket;
   request.symbol = symbol;
   request.volume = volume;
   request.deviation = 10;
   request.magic = MagicNumber;
   
   //--- For buy positions, we sell to close
   if(posType == POSITION_TYPE_BUY)
   {
      request.type = ORDER_TYPE_SELL;
      request.price = SymbolInfoDouble(symbol, SYMBOL_BID);
   }
   
   request.type_filling = ORDER_FILLING_IOC;
   
   if(OrderSend(request, result))
   {
      if(result.retcode == TRADE_RETCODE_DONE || result.retcode == TRADE_RETCODE_PLACED)
      {
         //--- Update statistics
         if(profit >= 0)
         {
            WinningTrades++;
         }
         else
         {
            LosingTrades++;
         }
         TodayProfit += profit;
         
         Print("========================================");
         Print("TAKE PROFIT HIT!");
         Print("Position closed: Ticket #", ticket);
         Print("Profit: $", DoubleToString(profit, 2));
         Print("========================================");
         
         //--- Send trade update to API
         SendTradeToApi(ticket, "closed", profit);
         SendBotStatusToApi();
      }
   }
   else
   {
      Print("Failed to close position: Ticket #", ticket, " Error: ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| Get current account status                                        |
//+------------------------------------------------------------------+
void PrintAccountStatus()
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double currentLoss = InitialCapital - equity;
   double lossPercent = (currentLoss / InitialCapital) * 100;
   
   Print("--- Account Status ---");
   Print("Initial Capital: ", DoubleToString(InitialCapital, 2));
   Print("Current Balance: ", DoubleToString(balance, 2));
   Print("Current Equity: ", DoubleToString(equity, 2));
   Print("Current Loss: ", DoubleToString(currentLoss, 2), " (", DoubleToString(lossPercent, 2), "%)");
   Print("Max Loss Allowed: ", DoubleToString(MaxLossAmount, 2), " (", MaxLossPercent, "%)");
   Print("Trading Enabled: ", TradingEnabled);
   Print("Total Trades: ", TotalTrades);
   Print("Win Rate: ", TotalTrades > 0 ? DoubleToString((double)WinningTrades / TotalTrades * 100, 2) : "0", "%");
   Print("----------------------");
}
//+------------------------------------------------------------------+
