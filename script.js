async function fetchContributionData() {
    const response = await fetch('https://dpg.gg/test/calendar.json');
    const data = await response.json();
    return data;
}

function showTooltip(contributionRange, date, target) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');


    tooltip.innerHTML = `<p>Contributions: ${contributionRange}</p><p class="tooltip-date"> ${date}</p>`;


    const targetRect = target.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const tooltipWidth = tooltip.offsetWidth;

    const tooltipTop = targetRect.top - tooltipHeight - 70;
    const tooltipLeft = targetRect.left - 70;

    tooltip.style.position = 'absolute';
    tooltip.style.top = `${tooltipTop + window.scrollY}px`;
    tooltip.style.left = `${tooltipLeft}px`;

    document.body.appendChild(tooltip);


    target.addEventListener('mouseout', () => {
        tooltip.remove();
    });
}


async function createContributionGraphWithTooltips() {
    const graphContainer = document.getElementById('graph');
    const monthLabelsContainer = document.querySelector('.month-labels');
    const today = new Date();
    const startDate = new Date(today);
    const months = [
        'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.',
        'Янв.', 'Февр.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль'
    ];

    months.forEach((month) => {
        const label = document.createElement('div');
        label.classList.add('month-label');
        label.textContent = month;
        monthLabelsContainer.appendChild(label);
    });
    startDate.setDate(startDate.getDate() - 50 * 7); 

    
    const contributionData = await fetchContributionData();

    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach((legendItem) => {
        const contributionRange = legendItem.dataset.countRange;
        legendItem.addEventListener('mouseover', () => {
            showTooltip(contributionRange, '', legendItem); 
        });
    });
    for (let j = 0; j < 7; j++) {
       
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() - (weekStart.getDay() - 1) + j);

        for (let i = 0; i < 51; i++) {
            
            const currentDate = new Date(weekStart);
            currentDate.setDate(currentDate.getDate() + i * 7);

            const dateString = currentDate.toISOString().slice(0, 10);
            const contributionCount = contributionData[dateString] || 0;

            const cell = document.createElement('div');
            cell.classList.add('contribution-cell');

            
            if (contributionCount === 0) {
                cell.classList.add('white');
            } else if (contributionCount < 10) {
                cell.classList.add('blue-1-9');
            } else if (contributionCount < 20) {
                cell.classList.add('blue-10-19');
            } else if (contributionCount < 30) {
                cell.classList.add('blue-20-29');
            } else {
                cell.classList.add('blue-30');
            }

            
            cell.addEventListener('mouseover', () => {
                showTooltip(contributionCount, currentDate.toLocaleString('ru-RU', {
                    weekday: 'long',      
                    month: 'long',        
                    day: 'numeric',       
                    year: 'numeric'       
                }), cell);
            });

            cell.addEventListener('mouseenter', () => {
                cell.classList.add('selected-cell');
            });

            cell.addEventListener('mouseleave', () => {
                cell.classList.remove('selected-cell');
            });

            graphContainer.appendChild(cell);
        }
    }
}

createContributionGraphWithTooltips();