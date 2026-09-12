# User Flows

## Human: Create Reliance Warrant
1. **Entry**: User clicks "Create Warrant" from the homepage.
2. **Input**: User pastes Evidence URL.
3. **Input**: User types Intended Action/Purpose.
4. **Input**: User selects Risk Level (Low/Medium/High).
5. **Wallet**: User clicks "Submit". Prompted to connect wallet if disconnected.
6. **Sign**: User signs GenLayer transaction.
7. **Processing**: UI displays "Transaction Submitted -> Awaiting GenLayer Consensus".
8. **Result**: UI transitions to `/warrant/[id]` displaying the forensic dossier and final status.

## Human: View Existing Warrant
1. **Entry**: User navigates directly to `/warrant/[id]` via URL or list.
2. **Fetch**: Frontend calls `get_warrant` on GenLayerJS (instant read).
3. **Render**: UI displays the Warrant Dossier (Hash, Purpose, Status, Reason).

## Human: Compare Same Evidence for Two Actions
1. **Entry**: User navigates to `/compare`.
2. **Fetch**: Frontend fetches two hardcoded/pre-computed Warrant IDs from Studionet.
3. **Render**: UI displays them side-by-side.
4. **Highlight**: UI visually connects the identical Evidence Hashes to draw the user's attention.

## Developer/Agent: Read Reliance Warrant and Determine Next Action
1. **Entry**: Developer views the compact developer section on the homepage `/`.
2. **Integration**: Developer writes script to fetch Warrant status via RPC.
3. **Action**:
   ```javascript
   const w = await contract.get_warrant("id_123");
   if (w.status === "WARRANTED") {
       executeTrade();
   } else {
       abortTrade();
   }
   ```

## Failure: INCONCLUSIVE
1. **Trigger**: During creation, the Evidence URL is down, or consensus is lost.
2. **Result**: The transaction succeeds but the state resolves to `INCONCLUSIVE`.
3. **Render**: UI displays the Dossier with an amber/gray `INCONCLUSIVE` stamp, explaining that the evidence could not be reliably evaluated.

## Failure: Transaction/Retrieval Failure
1. **Trigger**: RPC is down or wallet rejects signature.
2. **Render**: UI displays standard toast/alert error message and remains on the Create screen.
