import axios from "axios";
import express from "express";
import asyncHandler from "express-async-handler";
import Transaction from "../models/Transaction.js";

export const initialize = asyncHandler(async (req, res) => {
  const productCount = await Transaction.countDocuments();
  if (productCount === 0) {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Product.insertMany(response.data);
    console.log("Database initialized with seed data");
  }

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const startIndex = (page - 1) * limit;
  

  // Get total number of transactions
  

  // Search feature - Get search keyword from query params
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            title: {
              $regex: req.query.keyword, // Case-insensitive search
              $options: "i"
            }
          },
          {
            description: {
              $regex: req.query.keyword, // Case-insensitive search
              $options: "i"
            }
          }
        ]
      }
    : {}; // If no search keyword, return all records

  // Fetch paginated transactions
  // const transactions = await Transaction.find().skip(startIndex).limit(limit);

  // Filter by selected month (based on the passed query parameter 'month')
  const month = req.query.month ? parseInt(req.query.month) : "March";


// Initialize dateFilter
let dateFilter = {};

// Create a month filter if a month is selected
if (month  && !req.query.keyword) {
  dateFilter = {
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, month],
    },
  };
}else{
  dateFilter = {}
}

// Fetch paginated transactions based on keyword and date filter
const transactions = await Transaction.find({ ...keyword, ...dateFilter })
  .skip(startIndex)
  .limit(limit);

// Log transactions to console for debugging
console.log(transactions)
console.log((transactions.length));

  // Prepare pagination response
  const total = await Transaction.countDocuments({ ...keyword, ...dateFilter });

  const pagination = {
    currentPage: page, // Add the current page number
    totalPages: Math.ceil(total / limit),
  };

  // If there are more transactions to fetch, provide the next page details
  if (page * limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  // If this is not the first page, provide the previous page details
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  

  // Return the response with paginated data and pagination info
  res.json({
    status: "Success",
    message: "Data fetched successfully",
    pagination,
    data: transactions // Return the paginated transactions
  });
});

// export const initialize = asyncHandler(async (req, res) => {
//     const { page = 1, perPage = 10, search = '', month } = req.query;

//     // Validate month input
//     if (!month) return res.status(400).send("Month is required");

//     try {
//         // Check if the database is empty and initialize if needed
//         const productCount = await Transaction.countDocuments();
//         if (productCount === 0) {
//             const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//             await Transaction.insertMany(response.data);
//             console.log("Database initialized with seed data");
//         }

//         // Create the search query based on provided parameters
//         const query = {
//             dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) }
//         };

//         if (search) {
//             query.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { price: { $regex: search, $options: 'i' } }
//             ];
//         }

//         // Fetch transactions with pagination and search
//         const transactions = await Transaction.find(query)
//             .skip((page - 1) * perPage)
//             .limit(Number(perPage));

//         const total = await Transaction.countDocuments(query);

//         // Return paginated response
//         res.status(200).json({
//             transactions,
//             currentPage: Number(page),
//             totalPages: Math.ceil(total / perPage),
//             totalTransactions: total
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error handling the request' });
//     }
// });

export const getStatistics = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide a month between January and December"
    });
  }

  // Convert month name to a valid numeric representation (January = 1, February = 2, etc.)
  const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
  console.log(monthIndex + "  =  " + month);

  if (isNaN(monthIndex)) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid month name"
    });
  }

  // Fetch all transactions for the selected month (regardless of year)
  const transactions = await Transaction.find({
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, monthIndex]
    }
  });
  console.log(transactions);

  // Total Sale Amount (only for sold items)
  const totalSaleAmount = transactions
    .filter(transaction => transaction.sold)
    .reduce((sum, transaction) => sum + transaction.price, 0);

  // Total Number of Sold Items
  const totalSoldItems = transactions.filter(transaction => transaction.sold)
    .length;

  // Total Number of Unsold Items
  const totalUnsoldItems = transactions.filter(transaction => !transaction.sold)
    .length;

  // Return the statistics
  res.json({
    status: "Success",
    message: `Statistics for ${month}`,
    totalSaleAmount,
    totalSoldItems,
    totalUnsoldItems
  });
});

// Bar chart API: Get the number of items in each price range for a selected month
export const getBarChartData = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide a month between January and December"
    });
  }

  // Convert month name to a valid numeric representation (January = 1, February = 2, etc.)
  const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
  console.log(monthIndex);
  if (isNaN(monthIndex)) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid month name"
    });
  }

  // Fetch all transactions for the selected month (regardless of year)
  const transactions = await Transaction.find({
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, monthIndex]
    }
  });

  // Initialize the price range counts
  const priceRanges = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0
  };

  // Loop through transactions and count the number of items in each price range
  transactions.forEach(transaction => {
    const price = transaction.price;

    if (price >= 0 && price <= 100) {
      priceRanges["0-100"]++;
    } else if (price >= 101 && price <= 200) {
      priceRanges["101-200"]++;
    } else if (price >= 201 && price <= 300) {
      priceRanges["201-300"]++;
    } else if (price >= 301 && price <= 400) {
      priceRanges["301-400"]++;
    } else if (price >= 401 && price <= 500) {
      priceRanges["401-500"]++;
    } else if (price >= 501 && price <= 600) {
      priceRanges["501-600"]++;
    } else if (price >= 601 && price <= 700) {
      priceRanges["601-700"]++;
    } else if (price >= 701 && price <= 800) {
      priceRanges["701-800"]++;
    } else if (price >= 801 && price <= 900) {
      priceRanges["801-900"]++;
    } else if (price >= 901) {
      priceRanges["901-above"]++;
    }
  });

  // Return the bar chart data
  res.json({
    status: "Success",
    message: `Bar chart data for ${month}`,
    data: priceRanges
  });
});

// Pie chart API: Get unique categories and the number of items in each for a selected month
export const getPieChartData = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide a month between January and December"
    });
  }

  // Convert month name to a valid numeric representation (January = 1, February = 2, etc.)
  const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

  if (isNaN(monthIndex)) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid month name"
    });
  }

  // Fetch all transactions for the selected month (regardless of year)
  const transactions = await Transaction.find({
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, monthIndex]
    }
  });

  // If no transactions found for the month, return an empty response
  if (transactions.length === 0) {
    return res.json({
      status: "Success",
      message: `No transactions found for ${month}`,
      data: {}
    });
  }

  // Group the transactions by category and count the number of items in each
  const categoryCounts = transactions.reduce((acc, transaction) => {
    const category = transaction.category || "Uncategorized"; // Handle undefined categories
    acc[category] = (acc[category] || 0) + 1; // Increment the count for the category
    return acc;
  }, {});

  // Return the pie chart data
  res.json({
    status: "Success",
    message: `Pie chart data for ${month}`,
    data: categoryCounts
  });
});



export const getCombinedData = asyncHandler(async (req, res) => {
  const { month } = req.query;

  // Check if month is provided in query
  if (!month) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide a month between January and December"
    });
  }

  try {
    // Call the existing APIs internally using axios
    const [intialResponse, statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get(`http://localhost:3000/api/init?month=${month}`),
      axios.get(`http://localhost:3000/api/statistics?month=${month}`),
      axios.get(`http://localhost:3000/api/barChart?month=${month}`),
      axios.get(`http://localhost:3000/api/pie?month=${month}`),
    ]);

    // Extract data from each API response
    const initial = intialResponse.data;
    const statistics = statisticsResponse.data;
    const barChartData = barChartResponse.data;
    const pieChartData = pieChartResponse.data;

    // Return combined response
    res.json({
      status: "Success",
      message: `Combined data for ${month}`,
      initial,
      statistics,       // Data from getStatistics
      barChartData,     // Data from getBarChartData
      pieChartData      // Data from getPieChartData
    });

  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "An error occurred while fetching data"
    });
  }
});
