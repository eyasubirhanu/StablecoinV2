import { Lucid,
    MintingPolicy, 
    PolicyId, 
    TxHash,
    UTxO,
    Unit, 
    //utf8ToHex ,
    fromText,
    getAddressDetails,
    PaymentKeyHash,
    SpendingValidator,
    Script,
    Redeemer,
    Data,
    applyParamsToScript,
    Constr,
    Address} from "lucid-cardano"
import scripts from "../assets/scripts.json";
interface Options {
 lucid: Lucid
 address: string
 name: string
}

const { Mint, handlerContract,NFT } = scripts;

const handlerScript: Script = {
   type: "PlutusV2",
   script: handlerContract,
 };

const mintingPolicyScript: MintingPolicy = {
 type: "PlutusV2",
 script: Mint,
};


const nftPolicyScript: MintingPolicy = {
   type: "PlutusV2",
   script: NFT,
 };
 

// export declare function fromText(text: string): string;
// fully qualified asset name, hex encoded policy id + name
const getUnit = (policyId: PolicyId, name: string): Unit => policyId + fromText(name)


const HandlerDatum = Data.Object({
   state: Data.Boolean(),
   exchangeRate: Data.Integer(),
 });

 interface d {
   state: boolean;
   exchangeRate: bigint;
 }

 const b = {
    state: true,
    exchangeRate: 3000000n,
  };

 const datum = Data.to(b, HandlerDatum);
 
 const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
   const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)
 
   return policyId
 }
 
 export const findPubKeyHash = async (lucid:Lucid) => {
   const walletAddr = await lucid.wallet.address();
   const details = getAddressDetails(walletAddr);
   if (!details) throw new Error("Spending script details not found");
   const pkh = details.paymentCredential?.hash;
   if (!pkh) throw new Error("Spending script utxo not found");
   return pkh;
 };


 const getUtxo = async (lucid:Lucid,address: string)=> {
    const utxos = await lucid!.utxosAt(address);
    const utxo = utxos[0];
    return utxo;
};

const getFinalPolicy = async (lucid:Lucid,utxo: UTxO)=> {
    const tn = fromText("G NFT");
    const Params = Data.Tuple([Data.Bytes(), Data.Integer(), Data.Bytes()]);
    type Params = Data.Static<typeof Params>;
    const nftPolicy: MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript<Params>(
            "5909065909030100003233223322323232323232323232323232323232323232323232222223232533532323232325335533533355300d12001323212330012233350052200200200100235001220011233001225335002102610010232325335333573466e3cd400488008d401c880080940904ccd5cd19b87350012200135007220010250241024350012200235500122222222222200c10231335738921115554784f206e6f7420636f6e73756d65640002215335533532330215026001355001222222222222008102222135002222533500415335333573466e3c0080240a009c4ccd5cd19b87001480080a009c409c8840a4408c4cd5ce24811377726f6e6720616d6f756e74206d696e746564000221022135001220023333573466e1cd55cea802a4000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd406c070d5d0a80619a80d80e1aba1500b33501b01d35742a014666aa03eeb94078d5d0a804999aa80fbae501e35742a01066a03604a6ae85401cccd5407c099d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40c1d69aba150023031357426ae8940088c98c80cccd5ce01a01981889aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8183ad35742a00460626ae84d5d1280111931901999ab9c034033031135573ca00226ea8004d5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba1500533501b75c6ae854010ccd5407c0848004d5d0a801999aa80fbae200135742a00460486ae84d5d1280111931901599ab9c02c02b029135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00a60266ae84d5d1280291931900e99ab9c01e01d01b3333573466e1cd55ce9baa0064800080708c98c8070cd5ce00e80e00d1bae00633011375c00e6eb401840644c98c8064cd5ce2490350543500019135573ca00226ea8004c8004d5406488448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80c911999aab9f0012501b233501a30043574200460066ae8800804c8c8c8cccd5cd19b8735573aa004900011991091980080180118051aba150023005357426ae8940088c98c804ccd5ce00a00980889aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a1aba1500233500d013357426ae8940088c98c8060cd5ce00c80c00b09aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403466ae7006c06806005c0584d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201433573802a02802426ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355016223233335573e0044a032466a03066442466002006004600c6aae754008c014d55cf280118021aba200301113574200224464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900899ab9c01201100f00e135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c020d5d09aab9e500323333573466e1d40092004232122223002005300a357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900899ab9c01201100f00e00d00c135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011980298031aba15002375a6ae84d5d1280111931900699ab9c00e00d00b135573ca00226ea80048848cc00400c0088c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00580500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a00980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700340300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801401200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7002c02802001c0184d55cea80089baa0012323333573466e1d40052002200a23333573466e1d40092000200a23263200633573800e00c00800626aae74dd5000a4c24002921035054310032001355006222533500110022213500222330073330080020060010033200135500522225335001100222135002225335333573466e1c005200000a0091333008007006003133300800733500b12333001008003002006003122002122001112200212212233001004003112323001001223300330020020011",
            [utxo.txHash, BigInt(utxo.outputIndex), tn],
            Params
        ),
    };

    const policyId: PolicyId = lucid!.utils.mintingPolicyToId(nftPolicy);
    const unit: Unit = policyId + tn;

    return { nftPolicy, unit };
};

const getFinalScript = async (lucid:Lucid,pkh: PaymentKeyHash) => {

    if (!lucid ) return;
    const nftPolicyIdHex = "f07a742d15e1f6a5890fadc95e262a63c771e2db6876187011cfad70"
    const nftTokenNameHex = "47204e4654"

    const Params = Data.Tuple([Data.Bytes(), Data.Bytes(), Data.Bytes()]);
    type Params = Data.Static<typeof Params>;
    const handlerScript: SpendingValidator = {
        type: "PlutusV2",
        script: applyParamsToScript<Params>(
            "590d84590d81010000323322323322323232332232323232323232323232323232323232323232323232323222232232322322323253353330093333573466e1cd55cea803a400046604060366ae85401cdd69aba135744a00e464c6405466ae700700a80a0cccd5cd19b8750044800884880088cccd5cd19b8750054800084880048c98c80accd5ce00e8158148141999ab9a3370e6aae7540092000233221233001003002323232323232323232323232323333573466e1cd55cea8062400046666666666664444444444442466666666666600201a01801601401201000e00c00a00800600466a03803a6ae854030cd4070074d5d0a80599a80e00f1aba1500a3335502075ca03e6ae854024ccd54081d7280f9aba1500833501c02535742a00e666aa04004ceb4d5d0a8031919191999ab9a3370e6aae75400920002332212330010030023232323333573466e1cd55cea8012400046644246600200600466a060eb4d5d0a80118189aba135744a004464c6408066ae700c81000f84d55cf280089baa00135742a0046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40c1d69aba150023031357426ae8940088c98c8100cd5ce01902001f09aab9e5001137540026ae84d5d1280111931901e19ab9c02e03c03a135573ca00226ea8004d5d0a80299a80e3ae35742a008666aa04004440026ae85400cccd54081d710009aba150023024357426ae8940088c98c80e0cd5ce01501c01b09aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023014357426ae8940088c98c80a8cd5ce00e015014081489931901499ab9c4910350543500029135573ca00226ea80044d55ce9baa001135573ca00226ea8004c8888c8c8c94cd54cd4ccd5cd19b873535007220022233301c355335302100621350012200113263202933573892011568616e646c657220696e707574206d697373696e670002922220030020014800809008c40904cd5ce24918746f6b656e206d697373696e672066726f6d20696e70757400023153355335333573466e1cd4d401c8800888ccc070d54010888800c008005200202402310241335738920119746f6b656e206d697373696e672066726f6d206f75747075740002315335005153355001102413357389211568616e646c65722076616c7565206368616e67656400023153355335323235002222222222222533533355302f12001502e25335333573466e3c0380040cc0c84d40ec004540e8010840cc40c4d402088005400c40904cd5ce24811a6f70657261746f72207369676e6174757265206d697373696e67000231533553355335500110231024102413357389211e54686520646174756d2076616c7565206973206e6f74206368616e676564000231533553353301b50025003210251023102413357389211c54686520646174756d2076616c7565206973206e6f742076616c6964000231023102310231023153353301a500150022153355335350012200213500622002153353500622002102310241333573466e1cd400488004d40188800409008c408c408854cd54cd4c07400884d400488d40048888d402488d4008888888888888ccd54c0c44800488d400888894cd4d406088d401888c8cd40148cd401094cd4ccd5cd19b8f00200104404315003104320432335004204325335333573466e3c00800411010c5400c410c54cd400c854cd400884cd40088cd40088cd40088cd40088cc11400800481188cd400881188cc114008004888118888cd401081188894cd4ccd5cd19b8700600304904815335333573466e1c0140081241204ccd5cd19b870040010490481048104810411533500121041104113350410060051005503c00a132632025335738921024c6600025130234988854cd40044008884c09d261350012200232321233001003002375c00466aa0466eb800cdd70010919118011bac001320013550232233335573e0024a044466a04260086ae84008c00cd5d100100f919191999ab9a3370e6aae7540092000233221233001003002300a35742a004600a6ae84d5d1280111931900f99ab9c01101f01d135573ca00226ea80048c8c8c8c8cccd5cd19b8735573aa00890001199991110919998008028020018011919191999ab9a3370e6aae7540092000233221233001003002301335742a00466a01a0246ae84d5d1280111931901219ab9c016024022135573ca00226ea8004d5d0a802199aa8043ae500735742a0066464646666ae68cdc3a800a4008464244460040086ae84d55cf280191999ab9a3370ea0049001119091118008021bae357426aae7940108cccd5cd19b875003480008488800c8c98c8098cd5ce00c01301201181109aab9d5001137540026ae854008cd4025d71aba135744a004464c6404066ae700480800784d5d1280089aba25001135573ca00226ea80044cd54005d73ad112232230023756002640026aa04044646666aae7c008940808cd407ccd54084c018d55cea80118029aab9e500230043574400603a26ae84004488c8c8cccd5cd19b875001480008d4084c014d5d09aab9e500323333573466e1d400920022502123263201d33573801e03a03603426aae7540044dd5000919191999ab9a3370ea002900311909111180200298039aba135573ca00646666ae68cdc3a8012400846424444600400a60126ae84d55cf280211999ab9a3370ea006900111909111180080298039aba135573ca00a46666ae68cdc3a8022400046424444600600a6eb8d5d09aab9e500623263201d33573801e03a03603403203026aae7540044dd5000919191999ab9a3370e6aae7540092000233221233001003002300535742a0046eb4d5d09aba2500223263201933573801603202e26aae7940044dd50009191999ab9a3370e6aae75400520002375c6ae84d55cf280111931900b99ab9c00901701513754002464646464646666ae68cdc3a800a401842444444400646666ae68cdc3a8012401442444444400846666ae68cdc3a801a40104664424444444660020120106eb8d5d0a8029bad357426ae8940148cccd5cd19b875004480188cc8848888888cc008024020dd71aba15007375c6ae84d5d1280391999ab9a3370ea00a900211991091111111980300480418061aba15009375c6ae84d5d1280491999ab9a3370ea00c900111909111111180380418069aba135573ca01646666ae68cdc3a803a400046424444444600a010601c6ae84d55cf280611931901019ab9c01202001e01d01c01b01a019018135573aa00826aae79400c4d55cf280109aab9e5001137540024646464646666ae68cdc3a800a4004466644424466600200a0080066eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d4009200023212230020033008357426aae7940188c98c8064cd5ce00580c80b80b09aab9d5003135744a00226aae7940044dd5000919191999ab9a3370ea002900111909118008019bae357426aae79400c8cccd5cd19b875002480008c8488c00800cdd71aba135573ca008464c6402c66ae7002005805004c4d55cea80089baa00112232323333573466e1d400520042122200123333573466e1d40092002232122230030043006357426aae7940108cccd5cd19b87500348000848880088c98c805ccd5ce00480b80a80a00989aab9d5001137540024646666ae68cdc3a800a4004401e46666ae68cdc3a80124000401e464c6402666ae7001404c0440404d55ce9baa001490103505431002223232300100532001355017223350014800088d4008894cd4ccd5cd19b8f002009014013130070011300600332001355016223350014800088d4008894cd4ccd5cd19b8f0020070130121001130060032253335350022222002150122130040012321533535003222222222222300d00221300600115014320013550152253350011501522135002225335333573466e3c00801c0480444d40680044c01800c8c8c8c8ccccccd5d200211999ab9a3370e6aae7540112000233335573ea0084a02c46666aae7d40109405c8cccd55cf9aba25005253355335323232323333333574800846666ae68cdc3a8012400446666aae7d40108d40800609407c0688cccd5cd19b875003480008cccd55cfa80291a81080c1281000d9280f80c80c1280e9280e9280e9280e80c09aab9d5002135573ca00226ea8004d5d0a803909a80d18058008a80c10a99a991999999aba40012501b2501b2501b23501c375a0044a03602c6ae85401c84d406cc00800454064540609406004c0480449405403c9405094050940509405003c4d5d1280089aab9e500113754002442466002006004640026aa01e4422444a66a00220044426600a004666aa600e2400200a00800246a002446a0044444444444446666a01a4a0384a0384a0384666aa602424002a02246a00244a66aa66a666ae68cdc79a801110011a8021100100c00b8999ab9a3370e6a004440026a0084400203002e202e26a0400062a03e01a264246600244a66a004420062002004a016640026aa0184422444a66a00226a00644002442666a00a440046008004666aa600e2400200a00800244666ae68cdc780100080200189100109100091931900199ab9c49012365787065637465642065786163746c79206f6e652068616e646c6572206f757470757400003498480044488008488488cc00401000c448848cc00400c00848488c00800c4488004448c8c00400488cc00cc008008005",
            [nftPolicyIdHex, nftTokenNameHex, pkh],
            Params
        ),
    };
    return handlerScript;
};
// [nftPolicyIdHex, nftTokenNameHex, pkh],
export const mintNFT = async (lucid:Lucid) => {
    const wAddr = await lucid.wallet.address();
    console.log("minting NFT for " + wAddr);
    if (wAddr) {
        const utxo = await getUtxo(lucid,wAddr);
        const { nftPolicy, unit } = await getFinalPolicy(lucid,utxo);

        const tx = await lucid!
            .newTx()
            .mintAssets({ [unit]: 1n }, Data.void())
            .attachMintingPolicy(nftPolicy)
            .collectFrom([utxo])
            .complete();
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        return txHash;
    }
};

export const transfer = async (lucid:Lucid) => {
    const unit: Unit = "f07a742d15e1f6a5890fadc95e262a63c771e2db6876187011cfad7047204e4654";
    const wAddr = await lucid.wallet.address();

    if (!lucid || !wAddr) {
        alert("Please connect account and mint NFT!");
        return;
    }
    const pkh: string =
        getAddressDetails(wAddr).paymentCredential?.hash || "";
    const oracle = await getFinalScript(lucid,pkh);
    if (!oracle) {
        alert("Please mint NFT first!");
        return;
    }
    const handlerAddress = lucid!.utils.validatorToAddress(oracle);

  
    const tx = await lucid
      .newTx()
      .payToContract(
        handlerAddress,
            {
                inline: datum,
            },
            { [unit]: BigInt(1) }
        )
      .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
  };

 const findUtxo = async (lucid:Lucid,addr: Address , nftId: PolicyId, name: string) => {
   
   const utxos = await lucid.utxosAt(addr);
   console.log(await lucid.utxosAt(addr));
   const utxo = utxos.filter(
     (utxo) => utxo.assets[getUnit(nftId,name)]
   );
   console.log(utxo, "utxos");
   return utxo;
 };


 export async function getDatumValue(lucid: Lucid, name: string) {
   // await wait(10000);
   
   const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
   const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
   const utxos = await findUtxo(lucid, handlerAddress, nftId, name);
   const datum = await lucid.datumOf(utxos[0]);
   const datumValue: d = Data.from(datum, HandlerDatum);
   return datumValue;
 }
 
 export async function getAddressAda(lucid: Lucid, name: string) {
   const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
   const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
   const utxos = await findUtxo(lucid, handlerAddress, nftId, name);
   const lovelace = utxos.reduce((acc, utxo) => acc + utxo.assets.lovelace, 0n);
   return lovelace;
 }

 const redeemerMint = Data.to(new Constr(0, [])) as Redeemer;
 const redeemerUse = Data.to(new Constr(1, [])) as Redeemer;



 export const mintGcoin = async (lucid:Lucid,mintAmount: number,name: string) => {
   
   const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
   const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
   const mintPolicyId: PolicyId = getPolicyId(lucid, mintingPolicyScript);
   const utxo = await findUtxo(lucid,handlerAddress,nftId,name);
   const datum = await lucid.datumOf(utxo[0]);
   
   if (!datum) throw new Error("Spending script datumHash not found");
   const unhashDatum: d = Data.from(datum, HandlerDatum);
   let assets = { ...utxo[0].assets };
   const mintrate = unhashDatum.exchangeRate + unhashDatum.exchangeRate / 100n;
   assets.lovelace += BigInt(mintAmount) * mintrate;
   const unit: Unit = mintPolicyId+ fromText("GCOIN");
   const addr = await lucid.wallet.address();
   const tx = await lucid
     .newTx()
     .collectFrom(utxo, redeemerUse)
     .payToContract(handlerAddress, { asHash: datum}, assets)
     .payToAddress(addr, { [unit]: BigInt(mintAmount) })
     .mintAssets(
       { [unit]: BigInt(mintAmount) },
       Data.to(new Constr(0, [BigInt(mintAmount)])) as Redeemer
     )
     .attachMintingPolicy(mintingPolicyScript)
     .attachSpendingValidator(handlerScript)
     .complete();
   const signedTx = await tx.sign().complete();
   const txHash = await signedTx.submit();
   return txHash;
 };

 
 export const burnGcoin = async (
   lucid: Lucid,
   burnAmount: number,
   name: string
 ) => {
   const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
   const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
   const mintPolicyId: PolicyId = getPolicyId(lucid, mintingPolicyScript);
   const burnamount = Math.abs(burnAmount);
   const utxo = await findUtxo(lucid, handlerAddress, nftId, name);
   const datum  = await lucid.datumOf(utxo[0]);
   const unhashDatum: d = Data.from(datum, HandlerDatum);
   let assets = { ...utxo[0].assets };
   const burnrate = unhashDatum.exchangeRate - unhashDatum.exchangeRate / 100n;
   const pay = BigInt(burnamount) * burnrate;
   assets.lovelace -= pay
 
   const unit: Unit = mintPolicyId +  fromText("GCOIN");
   const addr: Address = await lucid.wallet.address();
   const pkh = await findPubKeyHash(lucid);
 
   const tx = await lucid
     .newTx()
     .collectFrom(utxo, redeemerUse)
     .payToContract(handlerAddress, { asHash: datum }, assets)
     .payToAddress(addr, { lovelace: pay })
     .mintAssets(
       { [unit]: BigInt(-burnamount) },
       Data.to(new Constr(1, [BigInt(-burnamount), pkh])) as Redeemer
     )
     .attachMintingPolicy(mintingPolicyScript)
     .attachSpendingValidator(handlerScript)
     .addSignerKey(pkh)
     .complete();
 
   const signedTx = await tx.sign().complete();
   const txHash = await signedTx.submit();
   return txHash;
 };
 const wait = (time: number) =>
   new Promise((resolve) => setTimeout(resolve, time));




   export const update = async ( 
     lucid: Lucid,
     exchangeRateAmount: BigInt,
     stateValue:boolean,
     name: string
   ) => {
     const d = {
       state: stateValue,
       exchangeRate: exchangeRateAmount,
     };
     
     const datum = Data.to(d, HandlerDatum);
     const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
     const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
     const pkh = await findPubKeyHash(lucid);
     const utxo = await findUtxo(lucid, handlerAddress, nftId, name);
     const unit: Unit = nftId + fromText("GNFT");
     const tx = await lucid
       .newTx()
       .collectFrom(utxo, redeemerMint)
       .payToContract(handlerAddress, { asHash: datum }, { [unit]: BigInt(1) })
       .attachSpendingValidator(handlerScript)
       .addSignerKey(pkh)
       .complete();
   
     const signedTx = await tx.sign().complete();
     const txHash = await signedTx.submit();
   
     return txHash;
   };
   