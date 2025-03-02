import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDateStore } from '../useDateStore';
import { useEvent } from '@/stores/EventContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TicketChart = () => {
  const { startDate, endDate, eventType } = useDateStore();
  const { events, transaction } = useEvent();

  // Step 1: Filter events by type and date range
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventStartDate);
    return eventType === 'Dont Specify'
      ? event
      : event.eventType === eventType && eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });

  // Step 2: Initialize event grouping by date
  const groupedEvents: Record<string, number> = {};
  filteredEvents.forEach((event) => {
    const eventDate = event.eventStartDate.split('T')[0]; // Get YYYY-MM-DD
    if (!groupedEvents[eventDate]) groupedEvents[eventDate] = 0;
    groupedEvents[eventDate] += event.maxAttendees;
  });

  // Step 3: Initialize sold ticket count by date
  const soldTicketsByDate: Record<string, number> = {};
  transaction
    .filter((tx) => tx.paymentStatus === 'completed')
    .forEach((tx) => {
      tx.events.forEach((e) => {
        const event = events.find((ev) => ev._id === e.id);
        if (!event) return;

        const eventDate = event.eventStartDate.split('T')[0];

        if (!soldTicketsByDate[eventDate]) soldTicketsByDate[eventDate] = 0;
        soldTicketsByDate[eventDate] += e.quantity;
      });
    });

  // Step 4: Prepare chart data
  const labels = Object.keys(groupedEvents).sort();
  const availableTicketsData: number[] = [];
  const soldTicketsData: number[] = [];

  labels.forEach((date) => {
    const totalAvailable = groupedEvents[date] || 0;
    const totalSold = soldTicketsByDate[date] || 0;

    availableTicketsData.push(totalAvailable - totalSold);
    soldTicketsData.push(totalSold);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Tickets Available',
        data: availableTicketsData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Tickets Sold',
        data: soldTicketsData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  // Calculate total sold and total available
  const totalSold = soldTicketsData.reduce((sum, value) => sum + value, 0);
  const totalAvailable = availableTicketsData.reduce((sum, value) => sum + value, 0);
  const totalTickets = totalSold + totalAvailable;

  // Calculate percentages
  const soldPercentage = totalTickets > 0 ? ((totalSold / totalTickets) * 100).toFixed(2) : '0';
  const availablePercentage = totalTickets > 0 ? ((totalAvailable / totalTickets) * 100).toFixed(2) : '0';

  // Calculate total revenue
  const totalRevenue = transaction
    .filter((tx) => tx.paymentStatus === 'completed')
    .reduce((sum, tx) => sum + tx.total, 0);

  return (
    <div className='space-y-10'>
      <h1 className='font-semibold'>
        SALES OVERVIEW <span className='font-normal'>(All Events)</span>
      </h1>
      <header className='flex gap-24 my-5'>
       
      <div className='flex-shrink-0'>
          <h1 className='uppercase text-xs font-semibold text-gray-600'>Tickets Sold</h1>
          <h2 className='text-lg font-bold'>{totalSold}</h2>
          <p className='text-sm font-medium text-gray-500'>
            <span className='font-semibold text-gray-700'>{soldPercentage}%</span> of total
          </p>
        </div>

        <div className='flex-shrink-0'>
          <h1 className='uppercase text-xs font-semibold text-gray-600'>Tickets Available</h1>
          <h2 className='text-lg font-bold'>{totalAvailable}</h2>
          <p className='text-sm font-medium text-gray-500'>
            <span className='font-semibold text-gray-700'>{availablePercentage}%</span> of total
          </p>
        </div>

        <div className='flex-shrink-0'>
          <h1 className='uppercase text-xs font-semibold text-gray-600'>Revenue</h1>
          <h2 className='text-lg font-bold'>${totalRevenue.toLocaleString()}</h2>
        </div>

        <div>
          <h1 className='uppercase text-xs font-semibold text-gray-600'>Revenue Details</h1>
          <p className='text-sm font-medium text-gray-500'>
            <span className='font-semibold text-gray-700'>
              Revenue shows the total earnings from completed ticket sales, helping track financial performance and
              sales trends
            </span>
          </p>
        </div>
      </header>
      <div className='h-72 overflow-hidden'>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Allow height control
            plugins: {
              legend: { position: 'bottom' },
            },
            scales: {
              y: {
                grid: {
                  display: false, // Hide horizontal grid lines
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TicketChart;
