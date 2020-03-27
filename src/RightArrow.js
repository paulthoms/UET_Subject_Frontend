import React, { useState, useEffect } from 'react';

const stylePending = {
    height: "100%",
    width: "100%",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255,0)",
    flexDirection: "column"
}

export default function RightArrow() {

    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {
                show ?
                    <div style={stylePending} >
                        <div class="rightArrow">
                        </div>
                    </div> : ""
            }
        </>
    )

}