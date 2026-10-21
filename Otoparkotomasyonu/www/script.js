// =========================================================
// PARK360 - SCRIPT.JS
// =========================================================

// =========================================================
// ANA SAYFA - HERO SLIDER
// =========================================================

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");

let currentSlide = 0;
let slideInterval;

// Slider göster
function showSlide(index) {
    if (slides.length === 0) return;

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active");
    }
}

// Önceki / sonraki slayt
function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
}

// Belirli slayta git
function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

// Otomatik slider
function startAutoSlide() {
    if (slides.length === 0) return;

    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Otomatik sliderı sıfırla
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// =========================================================
// OTOPARKLAR SAYFASI - ARAMA VE FİLTRELEME
// =========================================================

const parkingSearch = document.getElementById("parkingSearch");
const districtFilter = document.getElementById("districtFilter");
const statusFilter = document.getElementById("statusFilter");
const parkingCards = document.querySelectorAll(".parking-list-card");

// Otoparkları filtrele
function filterParkings() {
    const searchValue = parkingSearch ? parkingSearch.value.toLowerCase().trim() : "";
    const districtValue = districtFilter ? districtFilter.value : "all";
    const statusValue = statusFilter ? statusFilter.value : "all";

    let visibleCount = 0;

    parkingCards.forEach(card => {
        const name = (card.dataset.name || "").toLowerCase();
        const district = card.dataset.district || "";
        const status = card.dataset.status || "";

        // Müsait yer sayısını alma
        const metricValues = card.querySelectorAll(".parking-metrics strong");
        let availableSpaces = 0;

        if (metricValues.length >= 2) {
            availableSpaces = parseInt(metricValues[1].textContent.replace(/\D/g, ""), 10) || 0;
        }

        // Koşul kontrolleri
        const matchesSearch = name.includes(searchValue);
        const matchesDistrict = districtValue === "all" || district === districtValue;

        let matchesStatus = true;
        if (statusValue === "open") {
            matchesStatus = status === "open";
        } else if (statusValue === "available") {
            matchesStatus = availableSpaces > 0;
        }

        const shouldShow = matchesSearch && matchesDistrict && matchesStatus;

        if (shouldShow) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    // Sonuç sayısını güncelle
    const countElement = document.querySelector(".parking-count strong");
    if (countElement) {
        countElement.textContent = visibleCount;
    }

    showNoResultsMessage(visibleCount);
}

// =========================================================
// SONUÇ YOK MESAJI
// =========================================================

function showNoResultsMessage(count) {
    const grid = document.querySelector(".parking-list-grid");
    if (!grid) return;

    let message = document.querySelector(".no-parking-results");

    if (count > 0) {
        if (message) message.remove();
        return;
    }

    if (message) return;

    message = document.createElement("div");
    message.className = "no-parking-results";
    message.innerHTML = `
        <div>
            <span>⌕</span>
            <h3>Otopark bulunamadı</h3>
            <p>
                Arama veya filtre kriterlerinize uygun
                bir otopark bulunamadı.
            </p>
        </div>
    `;

    grid.appendChild(message);
}

// =========================================================
// SAYFA YÜKLENDİĞİNDE VE EVENT DINLEYICILERI
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    if (parkingCards.length > 0) {
        filterParkings();
    }
});

if (parkingSearch) {
    parkingSearch.addEventListener("input", filterParkings);
}

if (districtFilter) {
    districtFilter.addEventListener("change", filterParkings);
}

if (statusFilter) {
    statusFilter.addEventListener("change", filterParkings);
}