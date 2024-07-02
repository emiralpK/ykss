document.addEventListener('DOMContentLoaded', function() {
    const hesaplaButton = document.getElementById('hesapla');
    const temizleButton = document.getElementById('temizle');
    const puanTuruSelect = document.getElementById('puanTuru');

    hesaplaButton.addEventListener('click', hesapla);
    temizleButton.addEventListener('click', temizle);
    puanTuruSelect.addEventListener('change', alanlarıGuncelle);

    const katsayilar = {
        2023: { TYT: 1.32, SAY: 1.28, EA: 1.30, SOZ: 1.31, DIL: 1.29 },
        2022: { TYT: 1.30, SAY: 1.27, EA: 1.29, SOZ: 1.30, DIL: 1.28 },
        2021: { TYT: 1.29, SAY: 1.26, EA: 1.28, SOZ: 1.29, DIL: 1.27 },
        2020: { TYT: 1.28, SAY: 1.25, EA: 1.27, SOZ: 1.28, DIL: 1.26 }
    };

    const standartSapmalar = {
        2023: { TYT: 95, SAY: 110, EA: 105, SOZ: 100, DIL: 98 },
        2022: { TYT: 93, SAY: 108, EA: 103, SOZ: 98, DIL: 96 },
        2021: { TYT: 91, SAY: 106, EA: 101, SOZ: 96, DIL: 94 },
        2020: { TYT: 89, SAY: 104, EA: 99, SOZ: 94, DIL: 92 }
    };

    function alanlarıGuncelle() {
        const puanTuru = puanTuruSelect.value;
        const aytAlanlar = document.querySelectorAll('.ayt-table input');

        aytAlanlar.forEach(input => {
            const ders = input.id.split('Y')[0].toUpperCase();
            if (puanTuru === 'SAY' && ['MAT', 'FIZ', 'KIM', 'BIY'].includes(ders)) {
                input.disabled = false;
            } else if (puanTuru === 'EA' && ['MAT', 'EDG', 'TAR1', 'COG1'].includes(ders)) {
                input.disabled = false;
            } else if (puanTuru === 'SOZ' && ['EDG', 'TAR1', 'COG1', 'TAR2', 'COG2', 'FEL'].includes(ders)) {
                input.disabled = false;
            } else if (puanTuru === 'DIL' && ders === 'DIL') {
                input.disabled = false;
            } else {
                input.disabled = true;
                input.value = '';
            }
        });
    }

    function hesapla() {
        const tytNet = hesaplaTYT();
        const aytNet = hesaplaAYT();
        const puanTuru = puanTuruSelect.value;
        
        const yillar = [2023, 2022, 2021, 2020];
        yillar.forEach(yil => {
            const puan = hesaplaPuan(tytNet, aytNet, puanTuru, yil);
            const siralama = tahminEtSiralama(puan, puanTuru, yil);
            
            document.getElementById(`${puanTuru.toLowerCase()}HamPuan`).value = puan.toFixed(2);
            document.getElementById(`${puanTuru.toLowerCase()}HamSiralama${yil}`).value = siralama.toLocaleString();
        });
    }

    function hesaplaTYT() {
        const dersler = ['Turkce', 'Sosyal', 'Matematik', 'Fen'];
        let toplamNet = 0;

        dersler.forEach(ders => {
            toplamNet += hesaplaNet(`tyt${ders}`);
        });

        return toplamNet;
    }

    function hesaplaAYT() {
        const puanTuru = puanTuruSelect.value;
        let toplamNet = 0;

        const dersler = {
            SAY: ['mat', 'fiz', 'kim', 'biy'],
            EA: ['mat', 'edg', 'tar1', 'cog1'],
            SOZ: ['edg', 'tar1', 'cog1', 'tar2', 'cog2', 'fel'],
            DIL: ['dil']
        };

        dersler[puanTuru].forEach(ders => {
            toplamNet += hesaplaNet(ders);
        });

        return toplamNet;
    }

    function hesaplaNet(ders) {
        const dogru = Number(document.getElementById(ders).value) || 0;
        const yanlis = Number(document.getElementById(ders + 'Yanlis').value) || 0;
        const net = Math.max(0, dogru - (yanlis * 0.25));
        document.getElementById(ders + 'Net').value = net.toFixed(2);
        return net;
    }

    function hesaplaPuan(tytNet, aytNet, puanTuru, yil) {
        const tytPuan = 100 + (tytNet * 4 * katsayilar[yil].TYT);
        const aytPuan = 100 + (aytNet * 5 * katsayilar[yil][puanTuru]);
        const diplomaNotu = Number(document.getElementById('diplomaNotu').value) || 0;
        
        return tytPuan * 0.4 + aytPuan * 0.6 + diplomaNotu * 0.6;
    }

    function tahminEtSiralama(puan, puanTuru, yil) {
        const ortalamaP

uan = 300;
        const standartSapma = standartSapmalar[yil][puanTuru];
        const zSkor = (puan - ortalamaP

uan) / standartSapma;
        const toplamAday = 2000000;

        return Math.round(toplamAday * (1 - normalDagilimCDF(zSkor)));
    }

    function normalDagilimCDF(x) {
        return (1 + erf(x / Math.sqrt(2))) / 2;
    }

    function erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = (x >= 0) ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    function temizle() {
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        alanlarıGuncelle();
    }

    alanlarıGuncelle();
});