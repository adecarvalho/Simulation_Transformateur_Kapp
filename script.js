
//*************************** */
class App {
	constructor() {

		this.modelKapp = {
			rapport_m: 1.02,
			resistance_rp: 900,
			inductance_lp: 1.2,
			resistance_rs: 0.5,
			reactance_xs: 0.5
		}
		//
		this.reglages = {
			u1eff: 0,
			module: 500,
			phase: 0
		}
		//
		this.mesures = {
			u1eff: 0,
			u2eff: 0,
			i1eff: 0,
			i2eff: 0,
			p1: 0,
			p2: 0
		}
		//help kapp
		this.btnHelpKapp = document.getElementById('btn-help-kapp');
		this.myModale = document.getElementById('modale_id');

		//warning
		this.warningText = document.getElementById('warning-text-id');

		this.btnWarning = document.getElementById('btn-warning-id');

		//ranges
		this.rangeU1eff = document.getElementById('u1eff');
		this.rangeCharge = document.getElementById('charge');
		this.rangePhase = document.getElementById('phi2');

		this.textU1eff = document.getElementById('theU1eff');
		this.textCharge = document.getElementById('theCharge');
		this.textPhase = document.getElementById('thePhi');

		//mesures
		this.mesuresU1effRef = document.getElementById('mesures-value-u1eff');
		this.mesuresU2effRef = document.getElementById('mesures-value-u2eff');
		this.mesuresI1effRef = document.getElementById('mesures-value-i1eff');
		this.mesuresI2effRef = document.getElementById('mesures-value-i2eff');
		this.mesuresP1Ref = document.getElementById('mesures-value-p1');
		this.mesuresP2Ref = document.getElementById('mesures-value-p2');

		//form
		this.formref = document.getElementById("my-parameters-form");

		// Liaison immédiate des événements
		this.initEvents();
	}
	//
	_printWarning(txt) {
		this.warningText.textContent = txt;
	}
	//
	_displayMesures() {
		this.mesuresU1effRef.textContent = this.mesures.u1eff;
		this.mesuresU2effRef.textContent = this.mesures.u2eff;
		this.mesuresI1effRef.textContent = this.mesures.i1eff;
		this.mesuresI2effRef.textContent = this.mesures.i2eff;
		this.mesuresP1Ref.textContent = this.mesures.p1;
		this.mesuresP2Ref.textContent = this.mesures.p2;
	}
	//
	_process() {
		//console.log(this.reglages);

		const u1 = Number(this.reglages.u1eff);
		const module = Number(this.reglages.module);
		const phase = Number((this.reglages.phase * Math.PI) / 180);

		const m = Number(this.modelKapp.rapport_m);
		const rp = Number(this.modelKapp.resistance_rp);
		const lp = Number(this.modelKapp.inductance_lp);
		const rs = Number(this.modelKapp.resistance_rs);
		const xs = Number(this.modelKapp.reactance_xs);

		const reel = rs + module * Math.cos(phase);
		const img = xs + module * Math.sin(phase);
		const div = Math.sqrt(reel * reel + img * img);

		const i2 = (m * u1) / div || 0;
		const u2 = module * i2 || 0;
		const p2 = u2 * i2 * Math.cos(phase) || 0;

		const pertes = rs * i2 * i2 + (u1 * u1) / rp || 0;
		const p1 = p2 + pertes || 0;

		const q2 = u2 * i2 * Math.sin(phase);
		const q1 = q2 + (u1 * u1) / (314 * lp) + xs * i2 * i2;
		const s1 = Math.sqrt(p1 * p1 + q1 * q1);
		const i1 = s1 / u1 || 0;

		//
		this.mesures.u1eff = this.reglages.u1eff;
		this.mesures.u2eff = u2.toFixed(1);
		this.mesures.i1eff = i1.toFixed(2);
		this.mesures.i2eff = i2.toFixed(2);
		this.mesures.p1 = p1.toFixed(0);
		this.mesures.p2 = p2.toFixed(0);

		//console.log(this.mesures);

		this._displayMesures();
	}
	//
	initEvents() {
		//help image kapp
		this.btnHelpKapp.addEventListener('click', () => {
			this.myModale.style.display = 'block';
		});

		//ranges
		this.rangeU1eff.addEventListener('change', (event) => {
			const val = event.target.value;
			this.textU1eff.textContent = `${val} V`;
			this.reglages.u1eff = Number(val);

			this._process();
		});

		this.rangeCharge.addEventListener('change', (event) => {
			const val = event.target.value;
			this.textCharge.textContent = `${val} \u03A9`;
			this.reglages.module = Number(val);

			this._process();
		});

		this.rangePhase.addEventListener('change', (event) => {
			const val = event.target.value;
			this.textPhase.textContent = `${val} deg`;
			this.reglages.phase = Number(val);

			this._process();
		});

		//btn warning clear
		this.btnWarning.addEventListener('click', (event) => {
			this.warningText.textContent = '';
		});

		//form
		this.formref.addEventListener("submit", (event) => {
			event.preventDefault();

			const datas = new FormData(event.target);

			try {
				if (isNaN(datas.get('rapport_m'))) {
					throw new Error("Error parameter m !");
				}
				else {
					this.modelKapp.rapport_m = Number(datas.get('rapport_m'));
				}
				//
				if (isNaN(datas.get('resistance_rp'))) {
					throw new Error("Error parameter Rp !");
				}
				else {
					this.modelKapp.resistance_rp = Number(datas.get('resistance_rp'));
				}
				//
				if (isNaN(datas.get('inductance_lp'))) {
					throw new Error("Error parameter Lp !");
				}
				else {
					this.modelKapp.inductance_lp = Number(datas.get('inductance_lp'));
				}
				//
				if (isNaN(datas.get('resistance_rs'))) {
					throw new Error("Error parameter Rs !");
				}
				else {
					this.modelKapp.resistance_rs = Number(datas.get('resistance_rs'));
				}
				//
				if (isNaN(datas.get('reactance_xs'))) {
					throw new Error("Error parameter Xs !");
				}
				else {
					this.modelKapp.reactance_xs = Number(datas.get('reactance_xs'));
				}
				console.log(this.modelKapp);

			} catch (error) {
				this._printWarning(error.message);
			}
		});
	}

}
//
//********************************* */
// Point d'entrée de l'application : exécution dès que le DOM est totalement chargé
window.addEventListener('DOMContentLoaded', () => {
	window.app = new App();
});
//******************************* */
//end

