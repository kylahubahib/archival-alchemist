import { CategoryScale, Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineGraph({}) {
    const options = {
        responsive:true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "This is a Line Graph"
            }
        }
    }

    const data = {
    labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
    };


    return (
       <div className="w-full">
            <Line data={data} options={options}/>
       </div>
    );
}
     