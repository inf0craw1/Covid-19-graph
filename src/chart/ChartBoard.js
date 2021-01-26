import { useState, useEffect, useRef } from 'react';
import '../css/chart.scss';

export const ChartBoard = (props) => {

    const [chartWidth, setChartWidth] = useState(0);
    const [mouseOverBarHeight, setMouseOverBarHeight] = useState(0);

    const chartStyle = {
        width: props.width,
        height: props.height,
    }
    const barWrapper = useRef();
    const chartBoard = useRef();

    useEffect(() => {
        if(props.chartData != null){
            setChartWidth(barWrapper.current.offsetWidth);
            chartBoard.current.scrollLeft = chartWidth;
        }
    }, [props.chartData, chartWidth])

    const createChartBar = (datas, setMouseOverBarHeight) =>{
        let max = Math.max.apply(Math, datas.map(function(d){return d.newCovid}));
        max = Math.ceil(max/100)*100;
        let heights = datas.map((d) => { return (d.newCovid/max*100) });
        let covidChanges = datas.map((v, i) => {return ( (i === 0)? 0 : v.newCovid - datas[i-1].newCovid )});
        let elems = [];
        for(let [ index, data ] of datas.entries()){
            elems.push(
            <div key={"Bar"+index} className={"bar"} style={{height: heights[index]+'%'}} onMouseOver={handleBarMouseOver} onMouseOut={handleBarMouseOut}>
                <p className="top">{data.newCovid}</p>
                <div className={covidChanges[index] < 0 ? "tooltip minus" : "tooltip plus"} key={"tooltip"+index}>
                    <span className="triangle">{covidChanges[index] > 0 ? "▲" : "▼"}</span>
                    {Math.abs(covidChanges[index])}
                </div>
            </div>);
        }
        return elems;
    }
    const createChartAxisX = (datas) => { 
        let dates = datas.map((d) => { return d.date.substring(5)});
        let elems = [];
        for(let [index, date] of dates.entries()){
            elems.push(<p key={"axis"+index} className="axis-x">{date}</p>)
        }
        return elems;
    }
    const createChartAxisY = (datas, chartWidth) => { 
        let max = Math.max.apply(Math, datas.map(function(d){return d.newCovid}));
        max = Math.ceil(max/100)*100;
        let temp = 0, gap = 200;
        let elems = [];
        do{
            temp += gap;
            elems.push(<div key={"axisY" + temp} className={"axis-y" + ((temp/max*100 <= mouseOverBarHeight) ? " active" : "")} style={{width: chartWidth, height: temp/max*100 + "%"}}>
            </div>)
            
        } while (temp <= max)
        return elems;
    }

    const handleBarMouseOver = (e) => {
        setMouseOverBarHeight(e.target.style.height.split('.')[0].split('%')[0]);
    }
    const handleBarMouseOut = (e) => {
        setMouseOverBarHeight(0);
    } 
    const handleChartWheel = (e) => {
        chartBoard.current.scrollLeft += e.deltaY;
    }

    if(props.chartData != null){
        return(
            <div className="chart-bar">
                <h1>COVID-19 Graph KR</h1>
                <div className="chart-board" style={chartStyle} ref={chartBoard} onWheel={handleChartWheel}>
                    <div className="chart-axis-y">
                        <div className="axis-y-wrapper">
                            { createChartAxisY(props.chartData, chartWidth) }
                        </div>
                    </div>
                    <div className={"chart-bar-wrapper"} ref={barWrapper}>
                        { createChartBar(props.chartData) }
                    </div>
                    <div className="chart-axis-x">
                        { createChartAxisX(props.chartData) }
                    </div>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className="chart-bar">
                <h1>COVID-19 Graph KR</h1>
                <div className="chart-board" style={chartStyle}>
                    <div className="chart-loader">
                        <div className="loading-bar loading-bar-1"></div>
                        <div className="loading-bar loading-bar-2"></div>
                        <div className="loading-bar loading-bar-3"></div>
                        <div className="loading-bar loading-bar-4"></div>
                        <div className="loading-bar loading-bar-5"></div>
                    </div>
                    <h3 className="loading-text">LOADING</h3>
                </div>
            </div>
        );
    }
    
}