import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { isMobile } from 'react-device-detect';
import { range as d3range, bisect as d3bisect, zip } from 'd3-array';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { Group } from '@vx/group';
import { GridRows } from '@vx/grid';
import { LinePath, Line } from '@vx/shape';
import { scaleLinear, scalePoint } from '@vx/scale';
import classNames from 'class-names';

import YDIWrapper from "./ydiWrapper";
import { useWindowWidth } from '@react-hook/window-size';

import styles from "./ydiLine.module.css";

const brandPrimary = "#00345f";
const brandSecondary = "#A36A00";

const margin = {
    top: 10,
    left: isMobile ? 65 : 75,
    bottom: 50,
    right: 50,
}

// Accessors
const x = d => d.label;
const y = d => d.value;
const yGuess = d => d.guess;

const Marker = ({ x, y, textLines, color, drawPoint }) => {
    const height = textLines.length * 20 + 10;
    const width = Math.max(...textLines.map(text => String(text).length)) * 8 + 25;
    const margin = {
        bottom: 18,
    }
    return (
        <g transform={`translate(${x}, ${y - margin.bottom})`}>
            <rect
                x={-width / 2}
                y={-(height)}
                height={height}
                width={width}
                fill={color}
            />
            <polygon points="-6,-1 6,-1 0,11" fill={color} />
            {
                textLines.reverse().map((text, i) =>
                    <text
                        key={`marker-${i}`}
                        x={0}
                        y={-9 - i * 20}
                        fill={'white'}
                        textAnchor={'middle'}
                        fontWeight={'bold'}
                    >{text}</text>
                )
            }
            {drawPoint && <circle cx={0} cy={margin.bottom} r={4} fill={color} />}
        </g>
    );
}

const YDILineInternal = ({ name }) => {
    const question = useMemo(() => require(`../../../data/ydi/${name}.json`), [name])

    const knownData = question.knownData;
    const unknownData = question.unknownData;

    const firstKnown = question.knownData[0];
    const lastKnown = question.knownData[question.knownData.length - 1];
    const firstUnknown = question.unknownData[0];
    const lastUnknown = question.unknownData[question.unknownData.length - 1];

    const windowWidth = useWindowWidth();

    const width = useMemo(
        () => Math.min((windowWidth ? windowWidth : 768) - 35, 768),
        [windowWidth]
    );
    const height = useMemo(
        () => isMobile ? width * .9 : width * .75,
        [width]
    );

    const [guesses, setGuesses] = useState(
        question.unknownData.map(() => lastKnown.value
        ));
    const [hasGuessed, setHasGuessed] = useState(false);
    const [guessProgress, setGuessProgress] = useState(null);
    const [confirmed, setConfirmed] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [previewTarget, setPreviewTarget] = useState(null);

    const guessData = useMemo(
        () => zip(unknownData, guesses).map((pair) => ({
            ...pair[0],
            guess: pair[1],
        })),
        [guesses, unknownData]
    );

    const notAllData = useMemo(() => knownData.concat(unknownData), [knownData, unknownData]);

    // Bounds
    const xMax = useMemo(
        () => width - margin.left - margin.right,
        [width]
    );
    const yMax = useMemo(
        () => height - margin.top - margin.bottom,
        [height]
    );

    /* ### Scales ### */
    // Main X scale
    const xScale = useMemo(
        () => scalePoint({
            rangeRound: [0, xMax],
            domain: notAllData.map(x),
            padding: 0,
        }),
        [xMax, notAllData]
    );

    const yScale = useMemo(
        () => scaleLinear({
            rangeRound: [yMax, 0],
            domain: [0, question.maxY]
        }),
        [yMax, question.maxY]
    );

    const dragX = useMemo(() => xScale(x(lastKnown)) + margin.left, [xScale, lastKnown])

    // Callbacks
    const confirmCallback = useCallback(() => {
        setConfirmed(true);
    }, [setConfirmed])

    const guessCallback = useCallback((e, force) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rectPos = e.currentTarget.getBoundingClientRect();
        const xPos = clientX - rectPos.left + dragX - margin.left;
        const yPos = clientY - rectPos.top - margin.top;

        if (!isDragging && !hasGuessed) {
            setPreviewTarget({ x: xScale(x(firstUnknown)) - xScale.step() / 2, y: yPos });
        }

        if ((!isDragging && !force) || confirmed || yPos < 0) return;
        setPreviewTarget(null);

        const domain = xScale.domain();
        const range = xScale.range();
        const step = xScale.step();
        const rangePoints = d3range(range[0], range[1] + step, step)
        const label = domain[d3bisect(rangePoints, xPos + step / 2) - 1];
        const effectiveLabel = unknownData.findIndex(
            (d) => d.label === label) !== -1 ? label : unknownData[0].label;

        const newGuess = Math.max(0, yScale.invert(yPos));

        setHasGuessed(true);
        setGuessProgress(
            Math.max(guessProgress, unknownData.findIndex((d) => d.label === effectiveLabel)));
        setGuesses(
            guesses.map((guess, i) => unknownData[i].label === effectiveLabel ? newGuess : guess));
    }, [
        confirmed, hasGuessed, setHasGuessed, guesses, setGuesses, xScale, yScale, unknownData,
        guessProgress, isDragging, dragX, firstUnknown,
    ]);

    // Element memos
    const drag = useMemo(() => <div
        role="application"
        aria-hidden="true"
        style={{
            left: dragX,
            width: xScale(x(lastUnknown)) - xScale(x(lastKnown)),
            height: height - margin.bottom + 10,
        }}
        onMouseDown={(e) => { setIsDragging(true); guessCallback(e, true); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={guessCallback}
        onMouseLeave={() => setPreviewTarget(null)}
        onTouchStart={(e) => { setIsDragging(true); guessCallback(e, true); }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={guessCallback}
        className={classNames(styles.drag)}
    />, [dragX, guessCallback, setIsDragging, xScale, height, lastKnown, lastUnknown]);

    const groupKnown = useMemo(() =>
        <Group top={margin.top} left={margin.left}>
            <Marker
                x={xScale(x(firstKnown))}
                y={yScale(y(firstKnown))}
                textLines={[`${y(firstKnown)}${question.unit}`]}
                color={brandPrimary}
                drawPoint
            />
            <Marker
                x={xScale(x(lastKnown))}
                y={yScale(y(lastKnown))}
                textLines={[`${y(lastKnown)}${question.unit}`]}
                color={brandPrimary}
                drawPoint
            />
            <LinePath
                data={knownData}
                x={d => xScale(x(d))}
                y={d => yScale(y(d))}
                stroke={brandPrimary}
                strokeWidth={3}
            />
        </Group>,
        [xScale, yScale, knownData, firstKnown, lastKnown, question.unit]
    )

    const groupUnknown = useMemo(() => {
        const precision = Math.pow(10, question.precision);
        const markerLabel = `${
            Math.round(yGuess(guessData[guessData.length - 1]) * precision) / precision
            }${question.unit}`;
        return <Group top={margin.top} left={margin.left}>
            {confirmed &&
                <LinePath
                    data={[lastKnown].concat(unknownData)}
                    x={d => xScale(x(d))}
                    y={d => yScale(y(d))}
                    stroke={brandPrimary}
                    strokeWidth={3}
                />
            }
            <marker id="preview-arrow" orient="auto" markerWidth={4} markerHeight={6} refX={.1} refY={3}>
                <path d="M0,0 V6 L3,3 Z" fill="grey" />
            </marker>
            {previewTarget && <Line
                from={{ x: xScale(x(lastKnown)), y: yScale(y(lastKnown)) }}
                to={previewTarget}
                stroke="grey"
                strokeWidth={3}
                strokeDasharray="6,4"
                markerEnd="url(#preview-arrow)"
            />}
            <LinePath
                data={[
                    { ...lastKnown, guess: lastKnown.value }
                ].concat(guessData).slice(0, guessProgress !== null ? guessProgress + 2 : 0)}
                x={d => xScale(x(d))}
                y={d => yScale(yGuess(d))}
                stroke={brandSecondary}
                strokeWidth={3}
                strokeDasharray="6,4"
            />
            {guessProgress === unknownData.length - 1 && <Marker
                x={xScale(x(guessData[guessData.length - 1]))}
                y={yScale(yGuess(guessData[guessData.length - 1]))}
                textLines={[markerLabel]}
                color={brandSecondary}
            />}
            {confirmed &&
                <Marker
                    x={xScale(x(lastUnknown))}
                    y={yScale(y(lastUnknown))}
                    textLines={[`${y(lastUnknown)}${question.unit}`]}
                    color={brandPrimary}
                    drawPoint
                />
            }
        </Group>
    },
        [
            xScale, yScale, guessData, confirmed, guessProgress, lastKnown,
            unknownData, question.precision, question.unit, lastUnknown, previewTarget,
        ]
    )

    return (
        <YDIWrapper
            question={question}
            confirmAllowed={!confirmed && hasGuessed}
            onConfirm={confirmCallback}>
            <svg width={width} height={height}>
                <AxisBottom
                    top={yMax + margin.top}
                    left={margin.left}
                    scale={xScale}
                    stroke="black"
                    strokeWidth={1.5}
                    tickStroke="black"
                    tickLabelProps={(value, index) => ({
                        fill: "black",
                        fontSize: 16,
                        textAnchor: 'middle',
                    })}
                />
                <AxisLeft
                    top={margin.top}
                    left={margin.left + 1}
                    scale={yScale}
                    stroke="black"
                    strokeWidth={1.5}
                    tickStroke="black"
                    tickLabelProps={(value, index) => ({
                        fill: "black",
                        fontSize: 16,
                        textAnchor: 'end',
                        dy: '6px',
                        dx: '-4px',
                    })}
                    tickFormat={(value) => `${value}${question.unit}`}
                />
                <GridRows
                    left={margin.left}
                    top={margin.top}
                    lineStyle={{ pointerEvents: 'none' }}
                    scale={yScale}
                    width={xMax}
                    strokeDasharray="2,2"
                    stroke="rgba(0,0,0,0.3)"
                />
                {groupUnknown}
                {groupKnown}
            </svg>
            {!confirmed && drag}
        </YDIWrapper>
    );
};


const YDILine = ({ name }) => {
    require(`../../../data/ydi/${name}.json`);

    // Gatsby breaks stuff for some reason, so don't generate static build for this component
    if (typeof window === `undefined`) return <div></div>;

    return <YDILineInternal name={name} />;
};

YDILine.propTypes = {
    name: PropTypes.string,
};

export default YDILine;
