import react, { useEffect ,useState} from "react";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import { ethers } from "ethers";
import "./App.css";
// import { Web3Storage } from "web3.storage";

function App() {
  const [url,seturl]=useState('')
  const [link,setlink]=useState('')
  const contractAddress = "0x4fB3Bb312BDAf5B35AAd151C4660fA9FC8b3548a";
  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "caseId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "plaintiffLawyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "defendantLawyer",
          type: "address",
        },
      ],
      name: "CaseCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "caseId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "evidence",
          type: "string",
        },
      ],
      name: "EvidenceAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "caseId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "judge",
          type: "address",
        },
      ],
      name: "JudgeSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "caseId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "judgment",
          type: "string",
        },
      ],
      name: "JudgmentSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "caseId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "testimony",
          type: "string",
        },
      ],
      name: "WitnessTestimonyAdded",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_caseId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_evidence",
          type: "string",
        },
      ],
      name: "addEvidence",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_caseId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_testimony",
          type: "string",
        },
      ],
      name: "addWitnessTestimony",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
        {
          internalType: "address",
          name: "_plaintiffLawyer",
          type: "address",
        },
        {
          internalType: "address",
          name: "_defendantLawyer",
          type: "address",
        },
      ],
      name: "createCase",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getCase",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "plaintiffLawyer",
              type: "address",
            },
            {
              internalType: "address",
              name: "defendantLawyer",
              type: "address",
            },
            {
              internalType: "address",
              name: "judge",
              type: "address",
            },
            {
              internalType: "string[]",
              name: "evidences",
              type: "string[]",
            },
            {
              internalType: "string[]",
              name: "witnessTestimonies",
              type: "string[]",
            },
            {
              internalType: "string",
              name: "judgment",
              type: "string",
            },
            {
              internalType: "enum LegalRecord.State",
              name: "state",
              type: "uint8",
            },
          ],
          internalType: "struct LegalRecord.Case",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_caseId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_judge",
          type: "address",
        },
      ],
      name: "setJudge",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_caseId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_judgment",
          type: "string",
        },
      ],
      name: "setJudgment",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  let signer = null;
  let provider;

  async function main() {
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);
      console.log("MetaMask installed; using provider", provider);
      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
      console.log("Signer", signer);
    }
  }
  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    document
      .getElementById("registration")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const caseDescription =
          document.getElementById("caseDescription").value;
        const plaintiffLawyer =
          document.getElementById("plaintiffLawyer").value;
        const defendantLawyer =
          document.getElementById("defendantLawyer").value;
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        await contract.createCase(caseDescription, plaintiffLawyer, defendantLawyer);
        await send({ caseDescription, plaintiffLawyer, defendantLawyer });
      });

    document
      .getElementById("assign-judge")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const caseId = document.querySelector("#assign-judge #caseID").value;
        const judge = document.getElementById("judge").value;
        await contract.setJudge(caseId, judge);
        await send({ caseId, judge });
      });

    document
      .getElementById("submit-evidence")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const caseId = document.querySelector("#submit-evidence #caseID").value;
        const evidence = document.getElementById("evidence").value;
        await contract.addEvidence(caseId, evidence);
        await send({ caseId, evidence });
      });

    document
      .getElementById("submit-testimony")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const caseId = document.querySelector(
          "#submit-testimony #caseID"
        ).value;
        const testimony = document.getElementById("testimony").value;
        await contract.addWitnessTestimony(caseId, testimony);
        await send({ caseId, testimony });
      });

    document
      .getElementById("submit-verdict")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const caseId = document.querySelector("#submit-verdict #caseID").value;
        const verdict = document.getElementById("verdict").value;
        await send({ caseId, verdict });
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        await contract.setJudgment(caseId, verdict);
      });

    document
      .getElementById("get-case")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const caseId = document.querySelector("#get-case #caseID").value;
        const caseDetails = { ...(await contract.getCase(caseId)) };
        const caseDetailsDiv = document.getElementById("case-details");
        caseDetailsDiv.append("Case ID: " + caseDetails[0]);
        caseDetailsDiv.append(document.createElement("br"));
        caseDetailsDiv.append("Case Description: " + caseDetails[1]);
        caseDetailsDiv.append(document.createElement("br"));
        caseDetailsDiv.append("Case Plaintiff Lawyer: " + caseDetails[3]);
        caseDetailsDiv.append(document.createElement("br"));
        caseDetailsDiv.append("Case Defendant Lawyer: " + caseDetails[4]);
        caseDetailsDiv.append(document.createElement("br"));
        caseDetailsDiv.append("Case Judge: " + caseDetails[5]);
        caseDetailsDiv.append(document.createElement("br"));
        let caseState = "";
        if (caseDetails[9].toString()[0] == 0) {
          caseState = "Pending";
        } else if (caseDetails[9].toString()[0] == 1) {
          caseState = "In Progress";
        } else if (caseDetails[9].toString()[0] == 2) {
          caseState = "Closed";
        }
        caseDetailsDiv.append("Case State: " + caseState);
        if (caseState === "Closed") {
          caseDetailsDiv.append(document.createElement("br"));
          caseDetailsDiv.append("Case Judgement: " + caseDetails[8]);
        }
      });
    return () => {};
  }, []);

  async function send() {
    try {
      const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUyNGYzNUU2NTgyMURGQzc2ZDI2MjBCNmM4QkY5MjREQUQ1OTAyZDciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTgzMjY3MTE4MDQsIm5hbWUiOiJsZWdhbC1yZWNvcmQifQ.GPKmyODUzQfZwkvuYmRbpepopZew4EmuUlcu-WEw2fM" });
      const fileInput = document.querySelector('input[type="file"]');

      // Pack files into a CAR and send to web3.storage
      const rootCid = await client.put(fileInput.files);
      setlink(rootCid)
      seturl(`https://${rootCid}.ipfs.w3s.link/`)
      console.log(rootCid)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Legal Record Management Blockchain System</h1>
      <section>
        <h2>For all associated with the case</h2>
        <form id="get-case">
          <h3>View Case Details</h3>
          <label>
            Case ID:
            <input type="number" id="caseID" />
          </label>
          <button type="submit">Submit</button>
          <div id="case-details"></div>
        </form>
      </section>
      <section>
        <h2>Court</h2>
        <form id="registration">
          <h3>Register a new Case</h3>
          <label>
            Case Description:
            <input type="text" id="caseDescription" />
          </label>
          <label>
            Plaintiff Lawyer Account:
            <input type="text" id="plaintiffLawyer" />
          </label>
          <label>
            Defendant Lawyer Account:
            <input type="text" id="defendantLawyer" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <form id="assign-judge">
          <h3>Assign Judge</h3>
          <label>
            Case ID:
            <input type="number" id="caseID" />
          </label>
          <label>
            Judge Account:
            <input type="text" id="judge" />
            <button type="submit">Submit</button>
          </label>
        </form>
      </section>
      <section>
        <h2>Lawyer</h2>
        <form id="submit-evidence">
          <h3>Submit Evidence</h3>
          <label>
            Case ID:
            <input type="number" id="caseID" />
          </label>
          <label>
            Evidence:
            <input type="text" id="evidence" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <form id="submit-testimony">
          <h3>Submit Testimony</h3>
          <label>
            Case ID:
            <input type="number" id="caseID" />
          </label>
          <label>
            Testimony:
            <input type="text" id="testimony" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>
      <section>
        <h2>Judge</h2>
        <form id="submit-verdict">
          <h3>Submit Verdict</h3>
          <label>
            Case ID:
            <input type="number" id="caseID" />
          </label>
          <label>
            Verdict:
            <input type="text" id="verdict" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <input type="file" />
        <button
          onClick={async () => {
            console.log('hello')
            await send();
          }}
        >Click Here!</button>
        <div className>{url}</div>
      </section>
    </div>
  );
}

export default App;
