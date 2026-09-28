"use client";
import { useEffect } from "react";

export default function RefreshData() {
    // this component is added so page refreshes when someone presses back/forward navigation in browser
    // otherwise previous data will be shown
    useEffect(() => {
        window.addEventListener('pagereveal', () => {
            window.location.reload();
        });
    },[])
    return null;
}