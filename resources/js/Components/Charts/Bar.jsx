import { CategoryScale, Chart as ChartJS, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BarGraph({}) {
    const options = {
        responsive:true,
        plugins: {
            legend: {
                //display: false,
                position: "bottom",
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
        label: 'Bar Graph',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        barPercentage: 0.5,
        barThickness: 30,
        maxBarThickness: 50,
        minBarLength: 2,
        borderRadius: 20
    }]
    };


    return (
       <>
            <Bar data={data} options={options} />
       </>
    );
}
     