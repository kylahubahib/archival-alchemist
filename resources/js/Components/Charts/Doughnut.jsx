import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut} from "react-chartjs-2";

ChartJS.register(Tooltip, Legend, ArcElement);

export default function DoughnutChart({}) {
    const options = {
        responsive:true,
        plugins: {
            legend: {
                position: "right",
            }
        }
    }

    const data = {
        labels: [
          'Active',
          'Inactive'
        ],
        datasets: [{
          label: 'Personal Subscription',
          data: [300, 100],
          backgroundColor: [
            'rgb(101,220,49,255)',
            'rgb(231,54,91,255)'
          ],
          hoverOffset: 4
        }]
      };


    return (
       <div className="w-full">
            <Doughnut data={data} options={options} /> 
       </div>
    );
}
     