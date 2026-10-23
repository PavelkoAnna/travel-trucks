# 🧭 TravelTrucks

![TravelTrucks](public/hero.jpg)

Find your camper and head somewhere new.

TravelTrucks is my learning project for finding and renting campervans. You can choose a vehicle for your next trip, explore its interior, read reviews, and submit a booking request.

**[Visit the website](https://travel-trucks-gules-chi.vercel.app/) | [View the repository](https://github.com/PavelkoAnna/travel-trucks)**

## What you can do

🔎 **Find your camper**  
Search by city, vehicle type, engine, and transmission. **Load more** adds four more campers while keeping your filters active, and **Clear filters** resets your search.

🖼️ **Explore the details**  
Each camper’s details page opens in a new tab. It includes an image gallery with thumbnails, vehicle specifications, and reviews with five-star ratings.

✉️ **Send a booking request**  
Enter your name and email to submit a request. The form validates your details and displays a success message or an error.

A loading indicator appears while data is being fetched. If no campers match your search, you can clear the filters and return to the full catalog.

## On different screens

The interface adapts to desktops, tablets, and phones. On mobile, filters can be expanded and collapsed, cards use a vertical layout, and the gallery and booking form adjust to the screen width.

## Technologies

**Next.js | TypeScript | React | TanStack Query | CSS Modules | Swiper | React Icons**

Routing uses the Next.js App Router. I used `useInfiniteQuery` for pagination, `useQuery` to fetch camper details and reviews, and `useMutation` to submit booking requests.

## Run locally

You’ll need Node.js and npm.

Clone the repository:

```bash
git clone https://github.com/PavelkoAnna/travel-trucks.git
cd travel-trucks
```

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open the [local website](http://localhost:3000).

No environment variables are required. An internet connection is needed to fetch data and submit booking requests.

## Checks and production build

Check the code:

```bash
npx eslint .
```

Create a production build and run it locally:

```bash
npm run build
npm start
```

## Data

The application uses the TravelTrucks API to fetch the catalog, camper details, and reviews, and to submit booking requests.

[API documentation](https://campers-api.goit.study/docs)

## Author

**Anna Pavelko**

A learning project where I worked with Next.js, server-side filtering, pagination, and responsive layouts.

[My GitHub](https://github.com/PavelkoAnna)
