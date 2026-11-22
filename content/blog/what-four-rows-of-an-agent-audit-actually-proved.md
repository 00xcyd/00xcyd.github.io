---
title: "what four rows of an agent audit actually proved"
date: 2026-11-22
category: technical
ai-assist: 100
tags: [llm-agents, security, go, open-source]
topics: [development]
excerpt: "Four rows of the ARTEX audit ended with one merged patch and three negative results, and the useful part is the list of which protections are structural, which are advisory, and which switch turns them off."
---

*The table is full. The interesting column is not "vulnerable" or "safe", it is "what turns this off".*

The [ARTEX audit issue](https://github.com/BaaRai/ARTEX/issues/124) is a table of ways an agent can be talked into doing the wrong thing. I worked through four rows of it over three days: memory poisoning, plan hijacking, goal drift, and tool abuse. This post closes the series.

One row needed a patch. Three did not. That split is the result, and the reason I am writing a closing post at all is that "holds today" is a weaker claim than it sounds. Each row has a mechanism, a test, and a condition under which the mechanism stops helping. Those conditions are the part worth keeping.

I audited main at `22ae88a` and read the tests before believing the code.

## One patch: a fact has to quote the log

Row one was memory poisoning. A fact carries a `source` field, and that field decides whether `prove_goal` will accept the fact as evidence. The model wrote the field. A worker reading a hostile page could copy "admin access granted" into a fact, label it `tool_output`, and the goal gate would believe it.

The fix moved the decision from the model to the server. A fact's evidence now has to quote a line of the intent's recorded activity, and a miss costs the fact its authority rather than raising an error the model can retry around. Bytes the proxy captured coming back from the target are stored as `target_response` whatever the model declared.

The automated review on that pull request found a real ordering bug in the gate, and I fixed it in `42ce6ea`. The pull request was [merged as `2411943`](https://github.com/BaaRai/ARTEX/pull/441).

The maintainer named two limits on merge, and I have put them in the [row one writeup](https://cyberd4ch.github.io/blog/tying-a-fact-to-the-work-that-produced-it/) rather than leaving the stronger claim standing:

- With capture off, the tie is to recorded work, not to target authorship. A planted line that the model labels `tool_output` still ties, because the intent did run that command.
- Output the agent produced itself, an echo, a file it wrote, an earlier `record_fact`, is also recorded activity. The tie raises the bar for a hostile target. It does not prove where the bytes came from.

## Three negative results, with different reasons

A negative result is only useful if you know why it is negative. These three are negative for three different reasons: one is framing, one is ordering, one is parsing.

### Plan hijacking is framed

Row two asked whether planner-facing summaries are marked as untrusted. They are, in two independent layers: a code-owned data rule appended after the editable planner prompt, and a per-message nonce envelope around every target-derived field. The nonce is generated per message, so target text cannot close the envelope and start speaking as the system.

The proof is a deterministic bench that plants a hostile page and asserts the frame survives it. The limit is that framing is an instruction, not a sandbox. It lowers the odds that a hostile page gets obeyed. It does not stop a planner that decides to obey anyway, and the audit has no way to measure that from the outside.

### Goal drift is ordered

Row three is the slow version of hijacking. Nothing says "ignore the goal". The planner just reads a pile of worker summaries about interesting side paths and starts planning the side path.

The mitigation is structural: `plannerRoundInput` appends a code-owned goal anchor after all target-derived data, restating the operator goal and the constraints, with a rule that every intent must name the goal it serves. The goal is also in the system prompt, so it is read first and last with the data between. The anchor is outside the editable prompt template, and `TestPlannerRoundInputEndsWithGoalAnchor` proves a worker summary claiming the goal changed does not displace the real one.

The limit is semantic. The anchor cannot tell whether an intent actually advances the goal. Off-goal dispatch becomes a visible violation of a written rule, not a blocked call.

### Tool abuse is parsed

Row four asked whether a target can steer a tool. Two paths matter.

bbot output is reduced to typed fields, and the free text becomes one Go-quoted inert string, so it can never be a line of its own. Only typed `scope_distance == 0` may feed `insert_assets`, and intel events become `third_party_intel` facts, which the row one gate downgrades to unverified. The bbot path does not need a second untrusted label because its text is never parsed and its facts cannot prove a goal.

Custom command tools render `{param}` values through `shellQuote`, so a parameter containing `; rm -rf /` is one argument, not a second command. The target gate runs on the rendered command before the process starts, and the intercept layer behind it fails closed: an uncompilable deny rule is a deny, an unreadable rule store denies everything, and the judge's timeout action defaults to deny.

The limits are the ones that matter for a real engagement. Quoting protects the command template, not the semantics of the command. HTTP parameters are gated, not neutralised. The target gate can be off for a session, and then quoting remains while scope enforcement does not. bbot's scope distance is trusted as bbot computed it. Custom tools are operator-defined, so their blast radius is a configuration decision.

## The column that matters

Put the four rows side by side and the pattern is not a score. It is a dependency list.

Two protections are structural in the sense that a prompt cannot remove them: the provenance match and the target gate's position before execution. Two are ordering choices that a future refactor could quietly reverse: the goal anchor and the nonce envelope both depend on being assembled in the right place. One is a parser boundary, which is only as good as the fields someone chooses to type.

And every one of them has a switch. Capture off changes what a fact proves. Prompt overrides change what the planner reads. The target gate can be disabled. Custom tools are whatever the operator wrote. An audit that reports "mitigated" without naming the switch is reporting half the finding.

## What this audit did not cover

I audited four rows of one issue at one commit. That is not a code review and it is not a penetration test. Everything here comes from reading the Go and running the tests that exist, plus writing a test where the claim had none.

I did not run the agent against a live target with a hostile page. I did not try the prompt injections against a real model, only against the deterministic frames and benches in the repository. Row one's capture-off case is reasoned from the code path and the tests, not from an engagement where capture was off and a target tried it.

The other thing I did not do is grade severity. The issue asks whether a class of attack is possible, and the honest answer for three rows is "it is bounded, here is the bound". Whether the bound is tight enough for a given deployment depends on which switches that deployment has flipped.

## Closing the tab

The whole series is indexed on [one page](https://cyberd4ch.github.io/blog/artex-audit/), with each row's verdict in a line.

Row one shipped. Rows two, three and four hold on current main, with the limits written into their writeups instead of being left as assumptions. The doc comment the maintainer flagged on merge is a small follow-up pull request, [#469](https://github.com/BaaRai/ARTEX/pull/469), and the audit thread has the summary of all four rows.

The part I am taking away is not the patch. It is that a mitigation is a mechanism plus a switch, and the switch is usually a configuration value someone chose months ago and forgot about. When I read the next agent codebase, that is the first thing I will look for.

*Thanks to the ARTEX maintainer for the merge and for naming the two provenance limits precisely enough to write down.*
